use strict;
#use warinings;

my @years = ();
foreach my $line ( <STDIN> ) {
    chomp($line);
    push(@years, $line);
}
my $length = scalar @years;
if($length == 1) {
    print "@years[0]\n";
} else {
    print "@years[0] - @years[$length - 1]\n"
}
