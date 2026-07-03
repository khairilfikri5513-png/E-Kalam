#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "src/hooks/useUnitVocabulary.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/export function useUnitVocabulary\(unitKey: string\) \{/const vocabCache: Record<string, UnitVocabulary[]> = {};\n\nexport function useUnitVocabulary(unitKey: string) {/s;

$content =~ s/async function fetchVocab\(\) \{/async function fetchVocab() {\n      if (vocabCache[unitKey]) {\n        setVocabulary(vocabCache[unitKey]);\n        setLoading(false);\n        return;\n      }/s;

$content =~ s/setVocabulary\(mappedData\);/vocabCache[unitKey] = mappedData;\n          setVocabulary(mappedData);/s;

open my $out, ">", "src/hooks/useUnitVocabulary.ts" or die $!;
print $out $content;
close $out;
