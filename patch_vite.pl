#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "vite.config.ts" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/import \{defineConfig\} from 'vite';/import {defineConfig} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';/s;

$content =~ s/plugins: \[react\(\), tailwindcss\(\)\]/plugins: [\n      react(),\n      tailwindcss(),\n      VitePWA({\n        registerType: 'autoUpdate',\n        includeAssets: ['icon.png'],\n        manifest: {\n          name: 'E-Kalam',\n          short_name: 'E-Kalam',\n          description: 'Aplikasi pembelajaran Bahasa Arab E-Kalam',\n          theme_color: '#ffffff',\n          background_color: '#f8fafc',\n          display: 'standalone',\n          start_url: '\/',\n          icons: [\n            {\n              src: '\/icon.png',\n              sizes: '512x512',\n              type: 'image\/png',\n              purpose: 'any maskable'\n            }\n          ]\n        },\n        workbox: {\n          // Exclude supabase media urls or large files if any matches\n          navigateFallbackDenylist: [\n            \/^\\/api\\/assets\/\n          ],\n          runtimeCaching: [\n            {\n              urlPattern: \/\\/api\\/assets\/,\n              handler: 'NetworkFirst',\n              options: {\n                cacheName: 'api-assets-cache',\n                expiration: {\n                  maxEntries: 50,\n                  maxAgeSeconds: 60 * 60 * 24 // 1 day\n                },\n                cacheableResponse: {\n                  statuses: [0, 200]\n                }\n              }\n            },\n            {\n              urlPattern: \/^https:\\/\\/.*\\.supabase\\.co\\/storage\\/v1\\/object\\/public\\/.*\/,\n              handler: 'NetworkOnly', // do not cache large media from supabase heavily, or maybe StaleWhileRevalidate with very low limits\n            }\n          ]\n        }\n      })\n    ]/s;

open my $out, ">", "vite.config.ts" or die $!;
print $out $content;
close $out;
