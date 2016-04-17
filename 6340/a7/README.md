
# OMSCS Spring 2016 6340 Assignment 7

This repo contains two scripts:

1. Node.js script that checks work by comparing your output to the reference.
2. Bash script that automates the build-and-check process.

The checker includes handling for out-of-order Quads and IN/OUT set members.

## Getting Started

Once [Node](https://nodejs.org/en/download/) is installed in your system:

```
$ git clone https://github.com/mehmetbajin/gt-omscs.git
$ cd gt-omscs/6340/a7/checker
$ npm install
```

Copy the contents of the `a7` directory into the `<DIR>/dataflow/cs6340` directory (`<DIR>` is where you downloaded the assignment files):

```
$ cd ..
$ cp -r . <DIR>/dataflow/cs6340
```

Build the projects:

```
$ cd <DIR>/dataflow/cs6340/examples/array_demo
$ ant compile
$ cd <DIR>/dataflow/cs6340/examples/greatest_test
$ ant compile
$ cd <DIR>/dataflow/cs6340/examples/fibo_test
$ ant compile
$ cd <DIR>/dataflow/cs6340/examples/complex_test
$ ant compile
```

## Usage

The bash script takes two arguments, one for the target and one for the analysis:

```
$ cd <DIR>/dataflow/cs6340
$ bash run -h
```

For example, checking `liveness` against `greatest_test`:

```
$ bash run greatest_test liveness
```

If your analysis output matches the reference, the script outputs `Output matches expected.` Otherwise, it outputs the discrepancies:

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
