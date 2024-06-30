---
layout: post
title: Using LINQ and Lambda Expressions to Simplify Your C# Code
tags: dotnet programming beginner csharp c# .net
comments: true
---

Imagine this scenario. Suppose you have a list of student’s exam scores:

{% highlight csharp %}
var scores = new List<int>() { 83, 75, 46, 92 };
{% endhighlight %}

Now, you would like to create a new list, containing only the scores that pass a certain threshold. Let’s say 70. How do you achieve that?

The simplest way is to use `For` loop, which would look like this:

{% highlight csharp %}
for (int i = 0; i < scores.Count; i++)
{
    if (scores[i] > 70)
        passingScores.Add(scores[i]);
}
{% endhighlight %}

Then, using LINQ combined with Lambda expressions, we can refactor the code into just one line.

{% highlight csharp %}
var passingScores = scores.Where(score => score > 70);
{% endhighlight %}

Amazing, right? It is much simpler, easier on the eye, and therefore quicker to be understood, even by someone who is not a programmer.

In this article, we will discuss LINQ and Lambda expressions and how to use them so that your C# code is more succinct and readable. This article requires you to understand C# and SQL at a basic level.

## What is LINQ?

LINQ is short for Language-Integrated Query, a set of technologies based on the integration of query capabilities directly into the C# language. Simply put, LINQ allows you to retrieve data from different sources and formats using the same syntax. The query syntax itself is very similar to SQL, so if you are familiar with SQL, it will be a breeze.

What’s amazing about this is that you can retrieve data from a data collection like the List above using the same SQL-like syntax, which is more readable. For example, if the student exam scores were stored in a database table instead, how do we retrieve the passing scores using SQL query? Usually, the query would look like this, assuming the table name is `Scores` and the column name that stores the score is called `Score`.

{% highlight sql %}
SELECT Score 
FROM Scores 
WHERE Score > 70
{% endhighlight %}

We can implement this in C# as well by using LINQ. Firstly, you need to use the LINQ library if it is not available already.

{% highlight csharp %}
using System.Linq;
{% endhighlight %}

After that, we can start implementing LINQ. Here’s an example of the query:

{% highlight csharp %}
var passingScoresQuery = from score in scores
                         where score > 70
                         select score;
{% endhighlight %}

Now, `passingScoresQuery` has the `IEnumerable<int>` data type, which has the same behavior as `List`. However, the data has not yet been retrieved. To trigger the retrieval, the query needs to be called. We can iterate through it by using this For loop:

{% highlight csharp %}
foreach (var score in passingScoresQuery)
{
    Console.WriteLine(score);
}
{% endhighlight %}

The iteration above will trigger the execution and display all scores that are more than 70.

Wait, that is no longer one line of code as you promised in the introduction, you may be asking! Well, yes. This is the essence of LINQ. To simplify it further, we need a Lambda expression.

## What is a Lambda Expression?

So far, we have learned about LINQ query syntax. Alternatively, we can use method-based syntax or fluent syntax. This syntax uses extension methods that are equivalent to a query. Let me show the introduction example again.

{% highlight csharp %}
var passingScores = scores.Where(score => score > 70);
{% endhighlight %}

This does the same thing as the query syntax. Instead of creating a query, we call an extension method .Where(). Now let’s take a look at the in-line method inside it:

{% highlight csharp %}
score => score > 70
{% endhighlight %}

This is what we call a Lambda expression. We can recognize it from the `=>` symbol, which is called a Lambda operator, which reads as “goes to”. It is a convenient way to write code that would otherwise have to be written in a more cumbersome form such as an anonymous method. To be precise, here we’re using what is called a “Lambda expression”, with `score > 70` as its expression.

## Advanced Examples

Now that we have learned how LINQ works, let’s take the complexity up a little bit.

Let’s say we have a Student class that stores the student’s name and exam result.

{% highlight csharp %}
class Student
{
    public string Name { get; set; }
    public int Score { get; set; }
}
{% endhighlight %}

In the `Main` function, you can create an array of students.

{% highlight csharp %}
Student[] studentArray = {
    new Student() { Name = "John",  Score = 73 },
    new Student() { Name = "Steve", Score = 54 },
    new Student() { Name = "Bill",  Score = 69 },
    new Student() { Name = "Ram" ,  Score = 88 },
    new Student() { Name = "Ron" ,  Score = 91 },
    new Student() { Name = "Chris", Score = 77 },
    new Student() { Name = "Rob",   Score = 82 }
};
{% endhighlight %}

Now, you can start being creative with LINQ and Lambda. Remember to think in terms of SQL first before crafting your LINQ codes.

### Order

For example, say you would like to order the data by Name from A to Z and then by Score from the lowest to highest. How do you create a LINQ query for it?

First, imagine that `studentArray` is a SQL table, with Name and Score as its columns. Next, think of the appropriate SQL query.

{% highlight sql %}
SELECT *
FROM studentArray
ORDER BY Name ASC, Score ASC;
{% endhighlight %}

Then you can view the documentation for `System.Linq.Enumerable` to check for any related methods. For `ORDER BY`, we could use the `OrderBy` method for the first order, and the `ThenBy` method for subsequent sorting. The LINQ code would look like this:

{% highlight csharp %}
var studentOrdered = studentArray
    .OrderBy(student => student.Name)
    .ThenBy(student => student.Score);
{% endhighlight %}

### Grouping

We can also group data based on any criteria. For example, we want to group students based on the first letter in their name. For this, you can use the GroupBy function.

{% highlight csharp %}
var studentGrouped = studentArray
     .GroupBy(student => student.Name[0]);
{% endhighlight %}

Now say you want to display the grouping data. How many groups are there now? It is possible to create a new class inside the Lambda expression. In this example, we will create a new class called groupedStudent, with props named FirstLetter for each group’s first name letter, and StudentCount signifying the number of students in each group. Here is the code:

{% highlight csharp %}
var studentGrouped = studentArray
    .GroupBy(student => student.Name[0])
    .Select(groupedStudent => new { FirstLetter = groupedStudent.Key, StudentCount = groupedStudent.Count() });
{% endhighlight %}

To execute the query and see the result, create an iteration:

{% highlight csharp %}
foreach (var group in studentGrouped)
{
    Console.WriteLine($"We found {group.StudentCount} students names starting with the letter {group.FirstLetter}");
}
{% endhighlight %}

## Conclusion

We have demonstrated how to combine LINQ with Lambda expressions. It is a nice alternative to data processing in C# that is much more concise, intuitive, and human-readable than the usual C# loop methods. It is closer to SQL query than C# code. Therefore, if you have experience with SQL queries, it will be beneficial for you. Hopefully, this introduction helps you in your C# coding journey.

<em>This article originally appeared in [Mitrais Blog](https://www.mitrais.com/news-updates/using-linq-and-lambda-expressions-to-simplify-your-c-code/).</em>