type Transform<T> = T extends string ? Uppercase<T> : T extends number ? T | `${T}` : T extends boolean ? `${T}` : never

type Test1 = Transform<'hello'>;  // 'hello' | 'HELLO'
type Test2 = Transform<42>;       // 42 | '42'
type Test3 = Transform<true>;     // 'true'
type Test4 = Transform<false>;    // 'false'


type ExcludeProps<T, U> = { [P in keyof T as P extends U ? never : P]: T[P] }

type ExampleType = {
    id: number;
    name: string;
    age: number;
    visible: boolean;
};

type ResultType = ExcludeProps<ExampleType, 'age' | 'visible'>;
// 应该等于
// {
//   id: number;
//   name: string;
// }


type MakeReadOnly<T, K> = {
    [P in keyof T]: P extends K ? Readonly<T[P]> : T[P]
}

type User = {
    id: number;
    name: string;
    email: string;
};

type ReadOnlyUser = MakeReadOnly<User, 'id' | 'email'>;
// 应该等于
// {
//   readonly id: number;
//   name: string;
//   readonly email: string;
// }


type TupleToObject<T extends readonly any[]> = {
    [P in T[number]]: P;
};

type ExampleTuple = ['name', 'age', 'country'];

type ResultObject = TupleToObject<ExampleTuple>;
// 应该等于
// {
//   name: 'name';
//   age: 'age';
//   country: 'country';
// }


type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;



type Example = {
    id: number;
    name?: string;
    age?: number;
};

type UpdatedExample = RequiredBy<Example, 'name'>;
// 应该等于
// {
//   id: number;
//   name: string;  // "name" 现在是必需的
//   age?: number;
// }


