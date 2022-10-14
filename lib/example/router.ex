defmodule Example.Router do
  import Plug.Conn
  use Plug.Router
  require Logger
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
    randomUser = users |> Enum.random()

    Logger.info(["Selected user:", randomUser])
    # This pipes are cool asf
    userforRequest = getUserId(randomUser).body |> Jason.decode!()
    userId = userforRequest["data"]["id"]
    userName = userforRequest["data"]["username"]

    request = Example.Router.getTweet(userId).body |> Jason.decode!()
    Logger.info(["UserName:", userName, " ", "UserID:", userId])
    a = request["data"] |> Enum.random()
    tweet = a["text"]
    Logger.info(tweet)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!([tweet, userName]))
  end

  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, Jason.encode!("Not Found my boi"))
  end
end
