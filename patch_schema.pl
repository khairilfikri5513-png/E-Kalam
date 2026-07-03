#!/usr/bin/perl
local $/ = undef;
open my $fh, "<", "supabase_schema.sql" or die $!;
my $content = <$fh>;
close $fh;

$content =~ s/CREATE POLICY "Admin Manage e-kalam-assets" ON storage\.objects USING \(bucket_id = 'e-kalam-assets'\);/CREATE POLICY "Admin Manage e-kalam-assets" ON storage.objects USING (bucket_id = 'e-kalam-assets') WITH CHECK (bucket_id = 'e-kalam-assets');/g;

open my $out, ">", "supabase_schema.sql" or die $!;
print $out $content;
close $out;
