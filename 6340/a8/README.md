
# OMSCS Spring 2016 6340 Assignment 8

This repo contains two scripts:

1. Node.js script that checks work by comparing your output to the reference.
2. Bash script that automates the build-and-check process.

The checker includes handling for any out-of-order lines, reporting both the
lines in the reference but not in your output (missing) and vice versa (extra).

## Getting Started

Once [Node](https://nodejs.org/en/download/) is installed in your system:

```
$ git clone https://github.com/mehmetbajin/gt-omscs.git
$ cd gt-omscs/6340/a8/checker
$ npm install
```

Copy the contents of the `a8` directory into the `<DIR>/constraints` directory (`<DIR>` is where you downloaded the assignment files):

```
$ cd ..
$ cp -r . <DIR>/constraints
```

## Usage

The bash script takes two arguments, one for the target and one for the analysis:

```
$ cd <DIR>/constraints
$ bash run -h
```

Example output for checking `escape` against `test_case`:

```
$ bash run test_case escape
```

If your analysis output matches the reference, the script outputs `Output matches expected.` Otherwise, it outputs the discrepancies:

```
BUILDING (test_case, escape)
Buildfile: /Users/mbajin/Desktop/gt/6340/a8/constraints/build.xml

escape:

run:
     [java] Redirecting stdout to file: /Users/mbajin/Desktop/gt/6340/a8/constraints/examples/test_case/chord_output/log.txt
     [java] Redirecting stderr to file: /Users/mbajin/Desktop/gt/6340/a8/constraints/examples/test_case/chord_output/log.txt

BUILD SUCCESSFUL
Total time: 3 seconds

CHECKING RESULTS
CHECKING localMH...
  In expected but not in your output (missing):
    <main:([Ljava/lang/String;)V@TestCase,8!main:([Ljava/lang/String;)V@TestCase>
    <main:([Ljava/lang/String;)V@TestCase,36!main:([Ljava/lang/String;)V@TestCase>
    <clone:(LPoint;)V@Point,30!clone:(LPoint;)V@Point>
    <clone:(LPoint;)V@Point,48!clone:(LPoint;)V@Point>
    <distance:(LPoint;)Ljava/lang/Float;@Point,170!distance:(LPoint;)Ljava/lang/Float;@Point>
    <distance:(LPoint;)Ljava/lang/Float;@Point,88!distance:(LPoint;)Ljava/lang/Float;@Point>
```
