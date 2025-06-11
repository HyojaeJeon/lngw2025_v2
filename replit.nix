{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.bashInteractive
    pkgs.lsof
    pkgs.nix-output-monitor
  ];
}
