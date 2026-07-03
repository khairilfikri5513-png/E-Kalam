#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/pages/Home.tsx" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/import \{ Skeleton \} from "..\/components\/ui\/skeleton";/import { Skeleton } from "..\/components\/ui\/skeleton";\nimport { MediaAvatar } from "..\/components\/MediaAvatar";/g;

$content =~ s/<img loading="lazy" src=\{muallimKhairilAvatar\} alt="Muallim Khairil" className="w-full h-full object-contain drop-shadow-lg" \/>/<MediaAvatar src={muallimKhairilAvatar} alt="Muallim Khairil" className="w-full h-full object-contain drop-shadow-lg rounded-2xl" \/>/g;

$content =~ s/<img loading="lazy" src=\{card\.avatar\} alt="Muallim Khairil" className="w-full h-full object-contain" \/>/<MediaAvatar src={card.avatar} alt="Muallim Khairil" className="w-full h-full object-contain rounded-full" \/>/g;

$content =~ s/<img loading="lazy" src=\{muallimahUmmiAvatar\} alt="Muallimah Ummi" className="w-full h-full object-contain drop-shadow-lg" \/>/<MediaAvatar src={muallimahUmmiAvatar} alt="Muallimah Ummi" className="w-full h-full object-contain drop-shadow-lg rounded-2xl" \/>/g;

open my $out, ">", "src/pages/Home.tsx" or die $!;
print $out $content;
close $out;
