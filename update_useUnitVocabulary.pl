#!/usr/bin/perl

local $/ = undef;
open my $fh, "<", "src/hooks/useUnitVocabulary.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/export function useUnitVocabulary\(unitKey: string\) \{/const vocabCache: Record<string, UnitVocabulary[]> = {};\n\nexport function useUnitVocabulary(unitKey: string) {/g;

$content =~ s/if \(error\) throw error;/if (error) throw error;\n        if (data && data.length > 0) {\n          const mappedData = data.map((item) => ({\n            id: item.id,\n            arabic: item.arabic_text,\n            meaning: item.meaning_ms || "",\n            category: item.category || "",\n            audioUrl: item.audio_url,\n            imageKey: item.image_key,\n            imageUrl: item.image_url,\n            colorHex: item.color_hex,\n          }));\n          vocabCache[unitKey] = mappedData;\n          setVocabulary(mappedData);\n          return;\n        }/g;

# We will just replace fetchVocab logic carefully.

