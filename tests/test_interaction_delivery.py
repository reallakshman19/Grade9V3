import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from Shared.tools import build_explore_page, interaction_delivery, interaction_discovery, interaction_local_runtime, web_resolver

ROOT=Path(__file__).resolve().parents[1]
TARGETS=['MIC-MAT-LEQ-04-TWO-VARIABLES-LINE-OF-SOLUTIONS','Q-MAT-LEQ-04-1A-TEST-PAIRS']
SOURCE=ROOT/'Mathematics/interactions/linear-equations-two-variables.local.json'


class InteractionDelivery(unittest.TestCase):
    def test_consumer_academic_change_is_not_silently_rebound(self):
        from Shared.tools import interaction_reuse_binding
        source=ROOT/'Mathematics/interactions/linear-equations-two-variables.test-pairs.reuse-consumer.json'
        value=json.loads(source.read_text(encoding='utf-8'));value['consumer_basis_digest']='sha256:'+'0'*64
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'stale.json';path.write_text(json.dumps(value),encoding='utf-8')
            with self.assertRaisesRegex(ValueError,'CONSUMER_ACADEMIC_BASIS_STALE'):
                interaction_reuse_binding.compile_source(path)

    def test_one_upgrade_reaches_both_real_consumers_and_keeps_activity_identity(self):
        baseline=[interaction_delivery.resolve('Mathematics',t) for t in TARGETS]
        original=interaction_local_runtime.load
        def upgraded(path):
            value=original(path)
            if Path(path).resolve()==SOURCE.resolve():
                value['runtime_module']['model']['max']=8
            return value
        with patch.object(interaction_local_runtime,'load',side_effect=upgraded):
            revised=[interaction_delivery.resolve('Mathematics',t) for t in TARGETS]
        for before,after in zip(baseline,revised):
            self.assertEqual(before['runtime']['activity_ref'],after['runtime']['activity_ref'])
            self.assertNotEqual(before['runtime']['package_ref'],after['runtime']['package_ref'])
            self.assertEqual(after['package']['localRuntime']['model']['max'],8)
        self.assertEqual(revised[0]['package'],revised[1]['package'])

    def test_two_real_consumers_mount_the_same_runtime_in_chromium(self):
        with tempfile.TemporaryDirectory() as tmp:
            files=[]; packages=[]
            for target in TARGETS:
                request={'schema_version':'1.0.0','request_id':'RECOVERY-354','subject':'Mathematics',
                         'target':{'exact_ref':target},'experience_segments':[{'mode':'EXPLORE','interaction_requirement':'REQUIRED'}],
                         'packaging_mode':'SINGLE_FILE'}
                plan=web_resolver.resolve(request)
                self.assertTrue(plan['artifact_buildable'],plan['findings'])
                package=build_explore_page.compile_page_package(plan)
                packages.append(package['portable_package']['id'])
                file=Path(tmp)/(target+'.html'); build_explore_page.write_mode(package,'SINGLE_FILE',file); files.append(str(file))
            self.assertEqual(packages[0],packages[1])
            result=subprocess.run(['node','tests/interaction_delivery_browser.mjs',*files],cwd=ROOT,
                                  capture_output=True,text=True,encoding='utf-8',timeout=60)
            self.assertEqual(result.returncode,0,result.stdout+result.stderr)

    def test_stale_source_does_not_hide_valid_discovery(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=json.loads(SOURCE.read_text(encoding='utf-8')); source['academic_basis']['canonical_input_digest']='sha256:'+'0'*64
            stale=Path(tmp)/'stale.local.json'; stale.write_text(json.dumps(source),encoding='utf-8')
            with patch.object(interaction_discovery,'_local_source_paths',return_value=[SOURCE,stale]):
                index=interaction_discovery.build()
            self.assertTrue(index['implementations'])
            self.assertEqual(index['findings'][0]['status'],'STALE')

    def test_academic_revision_does_not_change_stable_activity_identity(self):
        baseline=interaction_local_runtime.compile_source(SOURCE)
        from Shared.tools import interaction_brief
        brief=interaction_brief.build_from_microtopic('Mathematics',TARGETS[0])
        brief['brief_id']='revised-brief-id'; brief['provenance']['canonical_input_digest']='sha256:'+'1'*64
        source=json.loads(SOURCE.read_text(encoding='utf-8')); source['academic_basis']['canonical_input_digest']=brief['provenance']['canonical_input_digest']
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'revised.local.json'; p.write_text(json.dumps(source),encoding='utf-8')
            with patch.object(interaction_brief,'build_from_microtopic',return_value=brief),patch.object(interaction_brief,'freshness',return_value={'status':'CURRENT'}):
                revised=interaction_local_runtime.compile_source(p)
        self.assertEqual(baseline['runtime']['activity_ref'],revised['runtime']['activity_ref'])
        self.assertNotEqual(baseline['runtime']['package_ref'],revised['runtime']['package_ref'])


if __name__=='__main__': unittest.main()
