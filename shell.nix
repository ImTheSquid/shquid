let
    pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    sass
    tailwindcss
    prettierd
    nixd
    bun
  ];
}
