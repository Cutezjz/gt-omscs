
# OMSCS Spring 2016 6340 Assignment 7: Dataflow Analysis

This repo contains a Node.js script for checking work and a bash script for automating the checking process.

## Getting Started

Once [Node](https://nodejs.org/en/download/) is installed in your system:

```
$ git clone https://github.com/mehmetbajin/gt-omscs.git
$ cd gt-omscs/6340/a7/checker
$ npm install
```

Copy the contents of the `a7` directory into the `<DIR>/dataflow/cs6340` directory, where `<DIR>` is where you downloaded the assignment files:

```
$ cd ..
$ cp -r . <DIR>/dataflow/cs6340
```

Build the projects:

```
$ cd <DIR>/dataflow/cs6340/examples/array_demo
$ ant build
$ cd <DIR>/dataflow/cs6340/examples/greatest_test
$ ant build
$ cd <DIR>/dataflow/cs6340/examples/fibo_test
$ ant build
$ cd <DIR>/dataflow/cs6340/examples/complex_test
$ ant build
```

## Usage

The bash script takes two arguments that determine which target and which analysis output are checked:

```
$ cd <DIR>/dataflow/cs6340
$ bash run -h
```

Example output for checking `liveness` against `greatest_test`:

```
mbajin cs6340 $ bash run greatest_test liveness
COMPILING
Buildfile: /Users/mbajin/Downloads/dataflow/cs6340/build.xml

compile:

BUILD SUCCESSFUL
Total time: 0 seconds

RUNNING ANALYSIS
Buildfile: /Users/mbajin/Downloads/dataflow/cs6340/build.xml

liveness:

run:
     [java] Redirecting stdout to file: /Users/mbajin/Downloads/dataflow/cs6340/examples/greatest_test/chord_output/log.txt
     [java] Redirecting stderr to file: /Users/mbajin/Downloads/dataflow/cs6340/examples/greatest_test/chord_output/log.txt

BUILD SUCCESSFUL
Total time: 2 seconds

COMPARING OUTPUT TO EXPECTED (greatest_test) (liveness)
Output matches expected.

FINISHED
mbajin cs6340 $
```

If your analysis output matches the reference, the script outputs `Output matches expected.`; otherwise, it outputs the discrepancies:

```
Discrepancies found.

Quads in reference but not in your output (missing):
Q13, Q20, Q35, Q40

Quads in your output but not in reference (extra):
Q203, Q335

Quads with an incorrect IN or OUT set:
    Q33:
        OUT:
            Element in reference but not in your output (missing):
                T37
    Q07:
        IN:
            Element in your output but not in reference (extra):
                Z12
```
