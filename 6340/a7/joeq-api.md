
# joeq API

Navigating the joeq API may not be immediately intuitive. This is compounded by the fact that API docs are not completely accurate.

Terms:

```
jq_Method        === java class method (e.g. ArrayDemo::main)
ControlFlowGraph === collection of BasicBlocks
BasicBlock       === collection of Quads
Quad             === the N in dataflow chaotic algorithm lecture videos
Register         === something used/defined by a quad
```

APIs relevant to this assignment:

```
jq_Method::getCFG()
    returns the control flow graph of the method

ControlFlowGraph::reversePostOrder()
    returns the basic blocks in the control flow graph

ControlFlowGraph::reversePostOrderOnReverseGraph()
    returns the basic blocks in the control flow graph in reverse order

BasicBlock::getPredecessors()
    returns List&lt;BasicBlock&gt; of preceding basic blocks

BasicBlock::getSuccessors()
    returns List&lt;BasicBlock&gt; of succeeding basic blocks

BasicBlock::getQuads()
    returns ordered List&lt;Quad&gt; of quads in the basic block

Quad::getDefinedRegisters()
    returns List&lt;RegisterOperand&gt; of registers defined by the quad

Quad::getUsedRegisters()
    returns List&lt;RegisterOperand&gt; of registers used by the quad

RegisterOperand::getRegister()
    returns the Register of a RegisterOperand
```

Example loop for iterating over every `Quad` in a method:

```
for (BasicBlock b : method.getCFG().reversePostOrder()) {
    for (Quad q : b.getQuads()) {
        List&lt;RegisterOperand&gt; defined = q.getDefinedRegisters();
        List&lt;RegisterOperand&gt; used = q.getUsedRegisters();

        // do something interesting
    }
}
```

Lastly, debugging is tedious. Below is a utility class that can help.

Sprinkle `Console.log(...)` or `Console.info(...)` statements, and flip the `ENABLE_INFO` / `ENABLE_LOG` switches as desired.

The output of this class is a bit more user-friendly than the native toString methods.

```java
private static class Console {
    public static final boolean ENABLE_INFO = false;
    public static void info(String s) {
        if (ENABLE_INFO) System.out.println(s);
    }

    public static final boolean ENABLE_LOG = false;
    public static void log(String s) {
        if (ENABLE_LOG) System.out.println(s);
    }

    private static String toString(BasicBlock block) {
        String s = String.format("BB%d", block.getID());
        return s.length() == 3 ? s + " " : s;
    }

    private static String toString(Quad quad) {
        String s = String.format("Q%d", quad.getID());
        return s.length() == 2 ? s + " " : s;
    }

    private static String toString(Register register) {
        String s = register.toString();
        return s.length() == 2 ? s + " " : s;
    }

    // LIVENESS

    private static String toString(Set&lt;Register&gt; set) {
        StringBuilder sb = new StringBuilder("[");

        Iterator&lt;Register&gt; iter = set.iterator();
        while (iter.hasNext()) {
            sb.append(Console.toString(iter.next()));
            if (iter.hasNext()) {
                sb.append(", ");
            }
        }

        return sb.append("]").toString();
    }

    // REACHDEF

    private static String toString(Pair&lt;Quad, Register&gt; pair) {
        return String.format("&lt;%s, %s&gt;",
            Console.toString((Quad)pair.val0),
            Console.toString((Register)pair.val1));
    }

    private static String toString(Set&lt;Pair&lt;Quad, Register&gt;&gt; set) {
        StringBuilder sb = new StringBuilder("[");

        Iterator&lt;Pair&lt;Quad, Register&gt;&gt; iter = set.iterator();
        while (iter.hasNext()) {
            sb.append(Console.toString(iter.next()));
            if (iter.hasNext()) {
                sb.append(", ");
            }
        }

        return sb.append("]").toString();
    }

    private static String toString(Map&lt;Quad, Set&lt;Pair&lt;Quad, Register&gt;&gt;&gt; map) {
        StringBuilder sb = new StringBuilder();

        for (Quad q : map.keySet()) {
            if (map.get(q) != null &amp;&amp; map.get(q).size() &gt; 0) {
                sb.append(Console.toString(q))
                    .append(": ")
                    .append(Console.toString(map.get(q)))
                    .append("\n");
            }
        }

        return sb.toString();
    }
}
```
