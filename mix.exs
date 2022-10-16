defmodule Example.MixProject do
  use Mix.Project

  def project do
    [
      app: :example,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Example.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:oauther, "~> 1.1"},
      {:httpoison, "~> 1.8"},
      {:jason, "~> 1.1"},
      {:json, "~> 1.4"},
      {:cors_plug, "~> 3.0"}
    ]
  end
end
