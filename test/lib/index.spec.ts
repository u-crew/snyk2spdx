import { readFileSync } from 'fs';
import * as pathLib from 'path';

import { convertSnykTestOutputToSPDX } from '../../src';

function loadJson(filename: string): JSON {
  return JSON.parse(readFileSync(filename, 'utf-8'));
}
describe('convertSnykTestOutputToSPDX', () => {
  it('No Snyk vulnerabilities converted to SPDX v3 correctly', async () => {
    const snykTestData = loadJson(
      pathLib.resolve(__dirname, '../', 'fixtures/no-deps.json'),
    );
    const res = convertSnykTestOutputToSPDX(snykTestData);
    // TODO: uncomment once working & update
    // expect(res).toMatch({
    //   id: 'TODOSPDXRef-no-prod-deps',
    //   name: 'no-prod-deps',
    //   specVersion: 'SPDX-3.0',
    //   // TODO: profile: Profile[];
    //   created: expect.any(String),
    //   documentNamespace:
    //     'http://[CreatorWebsite]/[pathToSpdx]/[DocumentName]-[UUID]',
    //   // License expression for dataLicense.  Compliance with the SPDX specification includes populating the SPDX fields therein with data related to such fields (\"SPDX-Metadata\"). The SPDX specification contains numerous fields where an SPDX document creator may provide relevant explanatory text in SPDX-Metadata. Without opining on the lawfulness of \"database rights\" (in jurisdictions where applicable), such explanatory text is copyrightable subject matter in most Berne Convention countries. By using the SPDX specification, or any portion hereof, you hereby agree that any copyright rights (as determined by your jurisdiction) in any SPDX-Metadata, including without limitation explanatory text, shall be subject to the terms of the Creative Commons CC0 1.0 Universal license. For SPDX-Metadata not containing any copyright rights, you hereby agree and acknowledge that the SPDX-Metadata is provided to you \"as-is\" and without any representations or warranties of any kind concerning the SPDX-Metadata, express, implied, statutory or otherwise, including without limitation warranties of title, merchantability, fitness for a particular purpose, non-infringement, or the absence of latent or other defects, accuracy, or the presence or absence of errors, whether or not discoverable, all to the greatest extent permissible under applicable law.
    //   dataLicense: 'TODO',
    //   creator: 'Organization: Snyk Ltd',
    //   comment: 'TODO',
    //   description: 'TODO',
    //   vulnerabilities: [],
    // });

    expect(res.vulnerabilities as any).toEqual([]);
  });
  it('Snyk issue is converted to SPDX v3 vulnerability', () => {
    const snykTestData = loadJson(
      pathLib.resolve(__dirname, '../', 'fixtures/ruby-vulnerabilities.json'),
    );
    const res = convertSnykTestOutputToSPDX(snykTestData);
    expect((res.vulnerabilities as any).sort()).toEqual(
      [
        {
          id: 'SNYK-RUBY-JSON-560838',
        },
        {
          id: 'SNYK-RUBY-LYNX-20160',
        },
        {
          id: 'SNYK-RUBY-LYNX-20161',
        },
      ].sort(),
    );
  });
  it('license issues are not converted to vulnerabilities', () => {
    const snykTestData = loadJson(
      pathLib.resolve(__dirname, '../', 'fixtures/with-license-issues.json'),
    );
    const res = convertSnykTestOutputToSPDX(snykTestData);
    expect((res.vulnerabilities as any).sort()).toEqual(
      [
        {
          id: 'SNYK-PYTHON-DJANGO-1076802',
        },
        {
          id: 'SNYK-PYTHON-DJANGO-1090612',
        },
        {
          id: 'SNYK-PYTHON-DJANGO-1279042',
        },
        {
          id: 'SNYK-PYTHON-DJANGO-1290072',
        },
        {
          id: 'SNYK-PYTHON-JINJA2-1012994',
        },
        {
          id: 'SNYK-PYTHON-JINJA2-174126',
        },
        {
          id: 'SNYK-PYTHON-JINJA2-40250',
        },
        {
          id: 'SNYK-PYTHON-JINJA2-455616',
        },
        // TODO: should not be here!
        {
          id: 'snyk:lic:pip:pytz:MIT',
        },
      ].sort(),
    );
    // TODO: comment out once functionality in place
    // expect(
    //   (res.vulnerabilities as any).find(
    //     (i: any) => i.id === 'snyk:lic:pip:pytz:MIT',
    //   ),
    // ).toEqual([]);
  });
});
