#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/hooks/useAppAssets.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/export function useAppAssets/const appAssetsCache: Record<string, Record<string, string>> = {};\n\nexport function useAppAssets/s;

$content =~ s/async function fetchAssets\(\) \{/async function fetchAssets() {\n        const keysParam = assetKeys.join(",");\n        if (appAssetsCache[keysParam]) {\n          setAssets(appAssetsCache[keysParam]);\n          setLoading(false);\n          return;\n        }/s;

$content =~ s/const keysParam = assetKeys.join\(\",\"\);//s;
$content =~ s/setAssets\(data\);/appAssetsCache[keysParam] = data;\n        setAssets(data);/s;

open my $out, ">", "src/hooks/useAppAssets.ts" or die $!;
print $out $content;
close $out;
