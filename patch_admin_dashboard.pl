#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/pages/admin/AdminDashboardScreen.tsx" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/import \{ useNavigate \} from "react-router-dom";/import { useNavigate } from "react-router-dom";\nimport { MediaAvatar } from "..\/..\/components\/MediaAvatar";/g;

$content =~ s/<img\s*src=\{muallimAvatar \|\| MuallimKhairilAvatarLocal\}\s*alt="Muallim Khairil"\s*className="w-full h-full object-contain"\s*\/>/<MediaAvatar src={muallimAvatar || MuallimKhairilAvatarLocal} alt="Muallim Khairil" className="w-full h-full object-contain rounded-full" \/>/gs;

$content =~ s/<img\s*src=\{muallimahAvatar \|\| MuallimahUmmiAvatarLocal\}\s*alt="Muallimah Ummi"\s*className="w-full h-full object-contain"\s*\/>/<MediaAvatar src={muallimahAvatar || MuallimahUmmiAvatarLocal} alt="Muallimah Ummi" className="w-full h-full object-contain rounded-full" \/>/gs;

open my $out, ">", "src/pages/admin/AdminDashboardScreen.tsx" or die $!;
print $out $content;
close $out;
