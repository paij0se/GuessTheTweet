defmodule Example.Router do
  import Plug.Conn
  use Plug.Router
  require Logger
  use Plug.ErrorHandler
  plug(CORSPlug)

  plug(:match)
  plug(:dispatch)

  def getUserId(username) do
    HTTPoison.get!(
      "https://api.twitter.com/2/users/by/username/#{username}",
      [
        {"Authorization", "Bearer " <> System.get_env("TOKEN")}
      ]
    )
  end

  def getUserpfp(username) do
    HTTPoison.get!(
      "https://api.twitter.com/2/users/by/username/#{username}?user.fields=profile_image_url",
      [
        {"Authorization", "Bearer " <> System.get_env("TOKEN")}
      ]
    )
  end

  def getTweet(id) do
    HTTPoison.get!(
      "https://api.twitter.com/2/users/#{id}/tweets?max_results=100",
      [
        {"Authorization", "Bearer " <> System.get_env("TOKEN")}
      ]
    )
  end

  get "/" do
    send_resp(conn, 200, "Pong!")
  end

  get "/tweets" do
    conn = Plug.Conn.fetch_query_params(conn)
    params = conn.query_params

    users = [params["u"], params["u2"], params["u3"], params["u4"]]

    if byte_size(params["u"]) == 0 || byte_size(params["u2"]) == 0 || byte_size(params["u3"]) == 0 ||
         byte_size(params["u4"]) == 0 do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(400, Jason.encode!(["error", "Empty field"]))
    end

    randomUser = users |> Enum.random()

    Logger.info(["Selected user:", randomUser])
    userforRequest = getUserId(randomUser).body |> Jason.decode!()
    # Handle if the use does not exist
    userId = userforRequest["data"]["id"]
    userName = userforRequest["data"]["username"]
    request = Example.Router.getTweet(userId).body |> Jason.decode!()
    Logger.info(["UserName:", userName, " ", "UserID:", userId])
    # Get a random tweet
    a = request["data"] |> Enum.random()
    tweet = a["text"]
    Logger.info(tweet)
    userpfp = fn user -> getUserpfp(user).body |> Jason.decode!() end

    winner = [
      tweet,
      userName,
      userpfp.(userName)["data"]["profile_image_url"],
      userpfp.(userName)["data"]["name"]
    ]

    users_profile_picture = [
      userpfp.(params["u"])["data"]["profile_image_url"],
      userpfp.(params["u2"])["data"]["profile_image_url"],
      userpfp.(params["u3"])["data"]["profile_image_url"],
      userpfp.(params["u4"])["data"]["profile_image_url"]
    ]

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!([winner, users_profile_picture]))
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{kind: _kind, reason: _reason, stack: _stack}) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(
      404,
      Jason.encode!([
        "Something went wrong!",
        "Something went wrong!",
        "Something went wrong!",
        "Something went wrong!"
      ])
    )
  end

  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, Jason.encode!("Not Found my boi"))
  end
end
