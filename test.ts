// class ListNode {
//   val: number;
//   next: ListNode | null;
//   constructor(val?: number, next?: ListNode | null) {
//     this.val = val === undefined ? 0 : val;
//     this.next = next === undefined ? null : next;
//   }
// }

import { bigint } from "zod";

// function addTwoNumbers(
//   l1: ListNode | null,
//   l2: ListNode | null
// ): ListNode | null {
//   const l3 = new ListNode();
//   const sum1 = getListReversedSum(l1);
//   const sum2 = getListReversedSum(l2);
//   const sum3: number = sum1 + sum2;
//   const sum3Str = sum3.toString();
//   const reversedSum3Str = sum3Str.split("").reverse().join("");

//   let current = l3;
//   for (let i = 0; i < reversedSum3Str.length; i++) {
//     current.val = +reversedSum3Str[i];
//     if (i === reversedSum3Str.length - 1) {
//       current.next = null;
//     } else {
//       current.next = new ListNode();
//       current = current.next;
//     }
//   }

//   return l3;
// }

// function getListReversedSum(list: ListNode | null): number {
//   let sumStr: string = "";
//   let current = list;
//   if (!current) return 0;
//   while (current.next !== null) {
//     sumStr += current.val;
//     current = current.next;
//   }
//   return +sumStr.split("").reverse().join("");
// }

// function createList(arr: number[]): ListNode {
//   const list = new ListNode();
//   let current = list;
//   for (var num of arr) {
//     current.val = num;
//     current.next = new ListNode();
//     current = current.next;
//   }
//   return list;
// }

// const l1 = createList([2, 4, 3]);
// const l2 = createList([5, 6, 4]);
// console.log(addTwoNumbers(l1, l2));

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const l3 = new ListNode();
  let sum1 = getListReversedSum(l1);
  console.log(sum1);
  let sum2 = getListReversedSum(l2);
  console.log(sum2);

  let sum3 = sum1 + sum2;
  console.log(sum3);
  const sum3Str = sum3.toString();
  const reversedSum3Str = sum3Str.split("").reverse().join("");
  let current = l3;

  for (let i = 0; i < reversedSum3Str.length; i++) {
    current.val = +reversedSum3Str[i];
    if (i === reversedSum3Str.length - 1) {
      current.next = null;
    } else {
      current.next = new ListNode();
      current = current.next;
    }
  }

  return l3;
}

function getListReversedSum(list: ListNode | null): number {
  let sumStr: string = "";
  let current = list;
  if (!current) return 0;
  while (current !== null) {
    sumStr += current.val;
    current = current.next;
  }
  console.log(sumStr.split("").reverse().join(""));
  const x = Number(sumStr.split("").reverse().join("")).toFixed();
  return Number(x);
}
