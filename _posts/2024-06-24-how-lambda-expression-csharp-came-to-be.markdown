---
layout: post
title: "C#: How Lambda Expressions Came to Be"
tags: dotnet programming intermediate csharp c# .net
---
In a [previous post]({% post_url 2024-06-21-using-linq-and-lambda-expressions-to-simplify-your-c-code %}), I wrote about using lambda expressions to simplify C# code, but I haven't touched on why lambda expressions look like that. To beginners in programming, it may seem like a big leap from traditional functions to lambda expressions—they might as well not be related at all. I think knowing how functions became lambda expressions is important in understanding how programming languages always evolve to a higher level.

## Function
Similar to the previous post I referred to, consider a case where we have student data and we want to know if a student passed the exam. We determine that a student passed if the score is above 70. We can make the class like this:
{% highlight csharp %}
class Student
{
    public string Name { get; set; }
    public int Score { get; set; }
}
{% endhighlight %}
And then you have a student named Andy:
{% highlight csharp %}
var andy = new Student { Name = "Andy", Score = 80 };
{% endhighlight %}
The function can be made like this:
{% highlight csharp %}
bool StudentPassed(Student student)
{
    return student.Score > 70;
}
{% endhighlight %}
You can then call the `StudentPassed` function to check if Andy passed the exam.
{% highlight csharp %}
bool isAndyPassed = StudentPassed(andy);
Console.WriteLine(isAndyPassed); // Output: True
{% endhighlight %}

Now imagine there are other students joining.
{% highlight csharp %}
var brian = new Student { Name = "Brian", Score = 60 };
var charlie = new Student { Name = "Charlie", Score = 90 };
{% endhighlight %}
It's probably better if you create a list of them.
{% highlight csharp %}
var students = new List<Student>{ andy, brian, charlie };
{% endhighlight %}
Now say we want to display the names of the students who passed the exam, with some fancy formatting. Well, that's easy. We can create a new function to show all the passed students. Loop through each student and if passed, show the name of each.
{% highlight csharp %}    
void ShowStudentsPassed(List<Student> studentList)
{
    // Fancy header
    foreach (var student in studentList)
    {
        // Fancy table
        if (StudentPassed(student))
        {
            Console.WriteLine(student.Name);
        }
    }
}
{% endhighlight %}
You can run this function like this:
{% highlight csharp %}
ShowStudentsPassed(students);
// Output:
// Andy
// Charlie
{% endhighlight %}

Now you might need to create a hundred more reports with different criteria, but with the same fancy formatting. And each criterion might not be used anywhere else except in each report. Here's an example of another criterion:
{% highlight csharp %}
bool StudentNeedsRetake(Student student)
{
    return student.Score <= 60;
}
{% endhighlight %}
What is the best way to solve this?

## Delegate
A delegate is an object that refers to multiple functions with the same signature. It means that you can declare a delegate with specific input and output types, and it could refer to any method/function with the same inputs and outputs.

In this case, we note that `StudentPassed()` and `StudentNeedsRetake()` have the same input type `Student` and the same output type `bool`. So we can declare a delegate that represents them all like this:
{% highlight csharp %}
delegate bool StudentCriteria(Student student);
{% endhighlight %}
And you can define the function to display students with _any_ criteria like this:
{% highlight csharp %}
void ShowStudentsByCriteria(List<Student> studentList, StudentCriteria criteria)
{
    // Fancy header
    foreach (var student in studentList)
    {
        // Fancy table
        if (criteria(student))
            Console.WriteLine(student.Name);
    }
}
{% endhighlight %}
Note that the delegate is used as the second parameter type. This means that you can pass the function name as an argument for `ShowStudentsByCriteria` and it will run inside the function as though the function is declared there.
{% highlight csharp %}
ShowStudentsByCriteria(students, StudentPassed);
// Output:
// Andy
// Charlie
ShowStudentsByCriteria(students, StudentNeedsRetake);
// Output:
// Brian
{% endhighlight %}
Neat, right?

## Anonymous Function
We solved the problem by defining a display function that could process different criteria. But there's another problem. Functions are meant to be reusable, but the criteria functions themselves are not really useful outside of the display function. Also, another programmer may use a criteria function outside your knowledge, and when you update the criteria function you could unknowingly break that guy's code. So what do we do to ensure that it is not called outside your domain?

Enter anonymous functions.

An anonymous function is a function that is declared without a name. Instead of declaring the function with a name (e.g. `StudentPassed()`) and then calling it and storing the result in a variable (e.g. `bool isAndyPassed`), it is directly declared into a variable. An anonymous function for `StudentPassed()` can look like this:
{% highlight csharp %}
Func<Student, bool> AnonymousStudentPassed = delegate (Student student) { return student.Score > 70; };
{% endhighlight %}
The type of variable is `Func<Student, bool>` which is the signature of the `StudentPassed` function. It means that the input type of the function is `Student` and the output type is `bool`. Note that the function itself is not named, only the variable that stores it. We can then pass `AnonymousStudentPassed` into a modified display function.
{% highlight csharp %}
void ShowStudentsByAnonymousCriteria(List<Student> students, Func<Student, bool> anonymousStudentCriteria)
{
    foreach (var student in students)
    {
        if (anonymousStudentCriteria(student))
            Console.WriteLine(student.Name);
    }
}
{% endhighlight %}
and later call it similarly.
{% highlight csharp %}
ShowStudentsByAnonymousCriteria(students, AnonymousStudentPassed);
{% endhighlight %}
In fact, if you want it to be completely anonymous, you don't even need to store the delegate in a variable. Just declare it straight in the display function.
{% highlight csharp %}
ShowStudentsByAnonymousCriteria(students, delegate (Student student) { return student.Score > 70; });
{% endhighlight %}
Can't be any simpler than this, right?

## Lambda Expression
Lambda expressions refer to function abstraction in lambda calculus, but the notation is taken from maplet notation, where `x ↦ y` means `x` maps to `y`, or input maps to function expression.

As the anonymous delegate only contains input (`Student student`) and function (`{ return student.Score > 70; }`), we can simplify the anonymous declaration like this:
{% highlight csharp %}
Func<Student, bool> LambdaStudentPassed = student => student.Score > 70;
{% endhighlight %}
It will work the same way as `AnonymousStudentPassed`. If we want to declare it in the display function directly, it will look like this: 
{% highlight csharp %}
ShowStudentsByAnonymousCriteria(students, student => student.Score > 70);
{% endhighlight %}
If the function `ShowStudentsByAnonymousCriteria` is instead declared as a method inside the `Student` class, or by using an extension class, then we can simply call the function like this:
{% highlight csharp %}
students.ShowStudentsByAnonymousCriteria(student => student.Score > 70);
{% endhighlight %}
In the LINQ case, LINQ contains extension methods for `IEnumerable` classes like `Where`, `Select`, and others. So if you want to show a list of only students that passed, you can state it like this:
{% highlight csharp %}
students.Where(student => student.Score > 70);
{% endhighlight %}
That is how a lambda expression came to be. 

## Conclusion
In this article, we deconstructed how a lambda expression is created. It started as a traditional function, passed to another function with a delegate, made more succinct as an anonymous function, and finally its notation was simplified by using a lambda expression. We can see how the entire process not only made functions simpler but also more reusable.

## References
- [Wikipedia on anonymous functions](https://www.wikiwand.com/en/Anonymous_function)
- [C# Reference on lambda expressions & anonymous functions](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions)
- [StackOverflow answer on delegates](https://stackoverflow.com/a/2082650/826214)
- [C# Reference on common patterns for delegates](https://learn.microsoft.com/en-us/dotnet/csharp/delegates-patterns)
- [Wikipedia on Maplet, the original arrow function](https://www.wikiwand.com/en/Maplet)