import { PlannerClient, ExecutorClient, TestAgentListener, TestCaseAgent, TestCaseDefinition, TestCaseResult } from 'magnitude-core';
import { Browser, chromium } from 'playwright';
import { BASE_TEST_RUNNER_DEFAULT_CONFIG, BaseTestRunner, BaseTestRunnerConfig } from './baseRunner';

export interface LocalRunnerConfig extends BaseTestRunnerConfig {
}

const DEFAULT_CONFIG = {
    ...BASE_TEST_RUNNER_DEFAULT_CONFIG,
} 

export class LocalTestRunner extends BaseTestRunner {
    private browser: Browser | null = null;

    constructor(config: { planner: PlannerClient, executor: ExecutorClient } & Partial<LocalRunnerConfig>) {
        super({ ...DEFAULT_CONFIG, ...config });
    }

    protected async setup() {
        // TODO: add appropriate launch args
        this.browser = await chromium.launch({ headless: false });
    }

    protected async teardown() {
        if (this.browser) this.browser.close()
    }

    protected async runTest(testCaseId: string, testCase: TestCaseDefinition, listener: TestAgentListener): Promise<TestCaseResult> {
        const agent = new TestCaseAgent({
            listeners: [listener],
            planner: this.config.planner,
            executor: this.config.executor
        });
        const result = await agent.run(this.browser!, testCase);
        return result;
    }
}