
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
Buildfile: .../a8/constraints/build.xml

escape:

run:
     [java] Redirecting stdout to file: .../a8/constraints/examples/test_case/chord_output/log.txt
     [java] Redirecting stderr to file: .../a8/constraints/examples/test_case/chord_output/log.txt

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

If the build fails, the script tails the last 25 lines of `log.txt` to help with diagnosis:

```
BUILDING (test_case, escape)
Buildfile: .../a8/constraints/build.xml

escape:

run:
     [java] Redirecting stdout to file: .../a8/constraints/examples/test_case/chord_output/log.txt
     [java] Redirecting stderr to file: .../a8/constraints/examples/test_case/chord_output/log.txt

BUILD FAILED
.../a8/constraints/build.xml:18: The following error occurred while executing this line:
.../a8/constraints/build.xml:26: Java returned: 1

Total time: 4 seconds
--------------------------------------------------------------------------------
Last 25 lines of examples/test_case/chord_output/log.txt are:
<<<
Exclusive time: 00:00:00:473 hh:mm:ss:ms
Inclusive time: 00:00:01:150 hh:mm:ss:ms
Starting command: 'java -ea -Xmx1024m -cp .../a8/constraints/chord.jar: -Dverbose=1 -Dbdd=j -Dbasedir=.../a8/constraints/examples/test_case/chord_output/bddbddb net.sf.bddbddb.Solver .../a8/constraints/src/escape.dlog '
UNREACHABLE: Cannot stratify! [] You need to specify one or more relations as "output", "printsize", etc.
Exception in thread "main" java.lang.RuntimeException
    at joeq.Runtime.DebugImpl.die(DebugImpl.java:25)
    at jwutil.util.Assert.UNREACHABLE(Assert.java:71)
    at net.sf.bddbddb.Stratify.breakIntoSCCs(Stratify.java:238)
    at net.sf.bddbddb.Stratify.stratify(Stratify.java:104)
    at net.sf.bddbddb.Stratify.stratify(Stratify.java:410)
    at net.sf.bddbddb.Solver.stratify(Solver.java:238)
    at net.sf.bddbddb.Solver.load(Solver.java:385)
    at net.sf.bddbddb.Solver.load(Solver.java:358)
    at net.sf.bddbddb.Solver.main2(Solver.java:448)
    at net.sf.bddbddb.Solver.main(Solver.java:1128)
java.lang.Error: Command 'java -ea -Xmx1024m -cp .../a8/constraints/chord.jar: -Dverbose=1 -Dbdd=j -Dbasedir=.../a8/constraints/examples/test_case/chord_output/bddbddb net.sf.bddbddb.Solver .../a8/constraints/src/escape.dlog ' terminated abnormally: Return value=1
    at chord.project.Messages.fatal(Messages.java:24)
    at chord.project.OutDirUtils.executeWithFailOnError(OutDirUtils.java:128)
    at chord.bddbddb.Solver.run(Solver.java:52)
    at chord.project.analyses.DlogAnalysis.run(DlogAnalysis.java:280)
    at chord.project.ClassicProject.runTask(ClassicProject.java:393)
    at chord.project.ClassicProject.runTask(ClassicProject.java:414)
    at chord.project.ClassicProject.run(ClassicProject.java:107)
    at chord.project.Main.run(Main.java:78)
    at chord.project.Main.main(Main.java:50)
>>>
```
