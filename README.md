# KodBoxProvider 
*( React +18 varient of KodBoxService for Angular )*

A powerful feature of KodBox is the ability to store and retrieve data from anywhere in your app. This is done by using the KodBoxProvider and the useKodBox hook. The KodBoxProvider is a React Context Provider that wraps the entire app (or part of the app where you need the functionality). The useKodBox hook is used to access the methods and data managed by the provider.


Not only does it have the ability to store and retrieve data, but it can also store and retrieve functions (lambdas). This is useful for storing functions that need to be accessed from anywhere in the app. For example, you can store a function that opens a modal, and then call that function from anywhere in the app without having to pass it down through props or using more traditional methods. The provider is made to remove complexity of tasks and allow developers to focus in on business logic and application features.


<br />

-------

<br />


### 1. Wrapping the Component Tree with KodBoxProvider


The first step is to wrap the root (or part of your app where you need the functionality) with KodBoxProvider.

```typescript
import React from 'react';
import { KodBoxProvider } from 'react-kodbox';  

function App() {
    return (
        <KodBoxProvider>
            <MyComponent />
        </KodBoxProvider>
    );
}
export default App;
```


<br />
<br />

### 2. Using the useKodBox Hook in a Child Component

Any child component nested inside the KodBoxProvider can now use the useKodBox hook to access the methods and data managed by the provider.


```typescript
import React from 'react';
import { useKodBox } from 'react-kodbox';

function MyComponent() {
    const { getProperty, setProperty, setLambda, lambda } = useKodBox();

    const handleClick = () => {
        setProperty('exampleKey', 'exampleValue');
        const value = getProperty('exampleKey');
        console.log(value);  // Should log 'exampleValue'

        setLambda('sayHello', () => {
            console.log('Hello from lambda!');
        });

        const helloFunction = lambda('sayHello');
        helloFunction();  // Should log 'Hello from lambda!'
    };

    return (
        <div>
            <button onClick={handleClick}>Test KodBox</button>
    </div>
);
}

export default MyComponent;
 ```

<br />


This pattern can be extended for all the methods provided by the KodBoxProvider. Whenever you need to use any of the methods, just use the useKodBox hook inside the component to gain access to them.

<br />



<br />

<br />

# Checking if a Property or Lambda Exists

<br />

You can check if the value exist, by checking against the key value it's suppose to have. This makes it safe for your app to check the value before trying to access a possible null referencce.

```typescript

const { has } = useKodBox(); 

if (has('exampleKey')) {
    // Do something
    const value = getProperty('exampleKey');
}

```

Same goes for lambdas:

```typescript

const { has } = useKodBox();

if (has('exampleLambda')) {
    // Do something
    lambda('exampleLambda')();
}

```


<br />

<br />
<br />

# Troubleshooting

<br />

Hmmm... if you are in trouble, I'm happy to help anyway that can...

Please feel free to open a new issue and I'll be sure to address it in a timely manner.
<br />

<br />


# Contribution

All contributions very welcome! And remember, contribution is not only PRs and code, but any help with docs or helping other developers to solve issues are very appreciated! Thanks in advance!


License
MIT


Thanks for linking up and really hope this package was useful to your needs. Please throw a Star if this was the case. Best of everything! Happy Coding!!!

