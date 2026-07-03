#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/pages/admin/AvatarUploadScreen.tsx" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/\{previewUrl \|\| currentAvatarUrl \? \(\n\s*\{\(previewUrl \|\| currentAvatarUrl!\)\?\\.match\(\/\\\\\.\(mp4\|webm\|ogg\|mov\)\/i\)/{previewUrl || currentAvatarUrl ? (\n                  (previewUrl || currentAvatarUrl!)?.match(\/\\.(mp4|webm|ogg|mov)\$\/i)/s;

open my $out, ">", "src/pages/admin/AvatarUploadScreen.tsx" or die $!;
print $out $content;
close $out;
