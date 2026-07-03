#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "server.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/console\.warn\("Database upsert error \(ignored due to RLS\):", dbErr\);/\/\/ console.warn("Database upsert error (ignored due to RLS):", dbErr);/g;

open my $out, ">", "server.ts" or die $!;
print $out $content;
close $out;
