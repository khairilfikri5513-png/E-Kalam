#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/hooks/useAppAssets.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/        if \(appAssetsCache\[keysParam\]\) \{/        const keysParam = assetKeys.join(",");\n        if (appAssetsCache[keysParam]) {/s;
$content =~ s/        const keysParam = assetKeys.join\(\",\"\);\n//s;

open my $out, ">", "src/hooks/useAppAssets.ts" or die $!;
print $out $content;
close $out;
