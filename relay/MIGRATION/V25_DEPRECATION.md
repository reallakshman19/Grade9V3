# Engineering Relay V2.5 deprecation notice

Status: **READ_ONLY_HISTORY**

V3 became the selected relay protocol at 2026-09-22T11:26:52.427226Z.

The preserved V2.5 tree remains at `agents/relay/**` with cutover digest:

```text
sha256:ada51948889504e905305dba6d0a631ab455eeadae791d837755abacac8401a9
```

After cutover:
- existing V2.5 files remain inspectable as migration/history evidence;
- new relay authority must be written through V3 objects and commands;
- do not append new DISC/QSET/QUAL/TC/checkpoint/projection authority to the legacy tree;
- any change to the preserved legacy tree invalidates V3 cutover conformance until explicitly reconciled.
