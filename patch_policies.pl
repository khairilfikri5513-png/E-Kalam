#!/usr/bin/perl
use strict;
use warnings;

my $filename = 'supabase_schema.sql';
local $/ = undef;
open(my $fh, '<', $filename) or die "Could not open file '$filename' $!";
my $content = <$fh>;
close $fh;

$content =~ s/CREATE POLICY ("[^"]+")\s*(ON|on)\s*(public\.)?(\w+)/DROP POLICY IF EXISTS $1 ON $4;\nCREATE POLICY $1 ON $3$4/g;

open(my $out, '>', $filename) or die "Could not open file '$filename' $!";
print $out $content;
close $out;
