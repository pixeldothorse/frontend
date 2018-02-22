import { Test } from './test';

window.onload = () => {
	Test.test();

	for (let i = 0; i < 10; i++) {
		console.log(i);
	}

	(window as any).test = Test.test;
};
