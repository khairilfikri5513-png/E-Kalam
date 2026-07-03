#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/pages/admin/AvatarUploadScreen.tsx" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/\{previewUrl \|\| currentAvatarUrl \? \(\n\s*\(\(previewUrl \|\| currentAvatarUrl!\)\?\\.match\(\/\\\\\.\(mp4\|webm\|ogg\|mov\)\\\$\/i\) \|\| \(selectedFile && selectedFile\.type\.startsWith\('video\/'\)\)\) \? \(\n\s*<video\n\s*src=\{previewUrl \|\| currentAvatarUrl!\}\n\s*controls\n\s*autoPlay\n\s*muted\n\s*loop\n\s*className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"\n\s*>\n\s*Browser anda tidak menyokong tag video\.\n\s*<\/video>\n\s*\) : \(\n\s*<img\n\s*src=\{previewUrl \|\| currentAvatarUrl!\}\n\s*alt="Preview"\n\s*className="max-w-full max-h-full object-contain drop-shadow-md"\n\s*\/>\n\s*\)\}\n\s*\) : \(/\{previewUrl \|\| currentAvatarUrl \? \(\n                  (previewUrl || currentAvatarUrl!)?.match(\/\\.(mp4|webm|ogg|mov)\$\/i) || (selectedFile && selectedFile.type.startsWith('video\/')) \? \(\n                    <video\n                      src={previewUrl || currentAvatarUrl!}\n                      controls\n                      autoPlay\n                      muted\n                      loop\n                      className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"\n                    >\n                      Browser anda tidak menyokong tag video.\n                    <\/video>\n                  \) : \(\n                    <img\n                      src={previewUrl || currentAvatarUrl!}\n                      alt="Preview"\n                      className="max-w-full max-h-full object-contain drop-shadow-md"\n                    \/>\n                  \)\n                \) : \(/s;

open my $out, ">", "src/pages/admin/AvatarUploadScreen.tsx" or die $!;
print $out $content;
close $out;
