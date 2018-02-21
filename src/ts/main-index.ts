import { Test } from './test';

window.onload = () => {
	Test.test();

	(window as any).test = Test.test;
}
