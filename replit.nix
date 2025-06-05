{ pkgs }: {
  deps = [
    pkgs.systemdMinimal
    pkgs.nano
    pkgs.haskellPackages.snap-templates
    pkgs.python312Packages.pyngrok
    pkgs.unzipNLS
    pkgs.wget
    pkgs.nodejs    # 이미 깔려 있을 수도 있지만 명시적으로 적어주세요
    pkgs.mysql     # MySQL 서버 데몬 설치
  ];
}
