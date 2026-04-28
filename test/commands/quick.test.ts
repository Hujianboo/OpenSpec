import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { runCLI } from '../helpers/run-cli.js';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

describe('quick command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'openspec-quick-command-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('creates a recorded quick change with quick.md and tasks.md', async () => {
    const result = await runCLI(['quick', 'Update pricing CTA copy'], { cwd: tempDir });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Created quick change 'quick-");
    expect(result.stdout).toContain('Created quick.md and tasks.md');
    expect(result.stdout).toContain('/opsx:do "Continue quick change');

    const changesDir = path.join(tempDir, 'openspec', 'changes');
    const entries = await fs.readdir(changesDir);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatch(/^quick-\d{8}-update-pricing-cta-copy$/);

    const quickPath = path.join(changesDir, entries[0], 'quick.md');
    const tasksPath = path.join(changesDir, entries[0], 'tasks.md');
    expect(await fileExists(quickPath)).toBe(true);
    expect(await fileExists(tasksPath)).toBe(true);

    const quickContent = await fs.readFile(quickPath, 'utf-8');
    expect(quickContent).toContain('Update pricing CTA copy');
    expect(quickContent).toContain('- Verify requested: no');
  });

  it('does not create files in no-record mode', async () => {
    const result = await runCLI(['quick', 'Update pricing CTA copy', '--no-record'], { cwd: tempDir });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Quick mode: no record will be created.');
    expect(result.stdout).toContain('/opsx:do "Update pricing CTA copy" --no-record');
    expect(await fileExists(path.join(tempDir, 'openspec'))).toBe(false);
  });

  it('records verify mode without running project checks', async () => {
    const result = await runCLI(['quick', 'Adjust mobile spacing', '--verify'], { cwd: tempDir });

    expect(result.exitCode).toBe(0);

    const changesDir = path.join(tempDir, 'openspec', 'changes');
    const [changeName] = await fs.readdir(changesDir);
    const quickContent = await fs.readFile(path.join(changesDir, changeName, 'quick.md'), 'utf-8');
    const tasksContent = await fs.readFile(path.join(changesDir, changeName, 'tasks.md'), 'utf-8');

    expect(quickContent).toContain('- Verify requested: yes');
    expect(tasksContent).toContain('Run a lightweight relevant verification check');
    expect(result.stdout).toContain('--verify');
  });

  it('errors without overwriting when the derived quick change already exists', async () => {
    const first = await runCLI(['quick', 'Update pricing CTA copy'], { cwd: tempDir });
    expect(first.exitCode).toBe(0);

    const second = await runCLI(['quick', 'Update pricing CTA copy'], { cwd: tempDir });
    expect(second.exitCode).toBe(1);
    expect(second.stderr).toContain("Quick change 'quick-");
    expect(second.stderr).toContain('already exists');

    const entries = await fs.readdir(path.join(tempDir, 'openspec', 'changes'));
    expect(entries).toHaveLength(1);
  });

  it('requires a request argument', async () => {
    const result = await runCLI(['quick'], { cwd: tempDir });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("missing required argument 'request'");
  });
});
