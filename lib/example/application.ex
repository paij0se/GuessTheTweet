defmodule Example.Application do
  use Application
  require Logger

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: Example.Router, options: [port: application_port()]}
    ]

    opts = [strategy: :one_for_one, name: Example.Supervisor]

    Logger.info("http://127.0.0.1:#{application_port()}")

    Supervisor.start_link(children, opts)
  end

  defp application_port do
    System.get_env()
    |> Map.get("PORT", "8080")
    |> String.to_integer()
  end
end
