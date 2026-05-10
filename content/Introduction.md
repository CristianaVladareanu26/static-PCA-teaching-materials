---
abstract: |
    Principal Component Analysis (PCA) is a widely used dimensionality reduction technique used in Machine Learning and Statistics. It is an unsupervised method that helps reduce the complexity of data by transforming it into a lower-dimensional space, making patterns and relationships within the data easier to understand, while preserving the most relevant information.
---

# Introduction

**Machine Learning (ML)** is a field of study that focuses on designing algorithms that learn patterns directly from data. Rather than relying on explicitly programmed rules, machine learning systems use data to automatically identify relationships, detect structure, and make predictions or decisions.

At the core of machine learning lies **data**. 

A dataset consists of multiple objects (also called data points or samples). To use an object in a machine learning algorithm, we must represent it numerically. But how do we represent a real-world object so that a mathematical function can process it?

We do this by measuring relevant properties of the object. These measurements are called *features*. All features describing an object are combined into a vector, called a *feature vector*.

```{admonition}  Example: a house object
:class: dropdown
:open: true
:icon: false
Suppose we want to buy a house. We describe the house as an object using a few numbers (features):

- x₁: Size (in square meters) = 120  
- x₂: Number of rooms = 4  
- x₃: Year of construction = 1980  

Then the corresponding feature vector is:
\begin{bmatrix}
120 \\
4 \\
1980
\end{bmatrix}
```

Each feature represents one measurable *dimension* of the data. If a dataset contains:
- 1 feature → the data is one-dimensional
- 2 features → the data is two-dimensional
- 3 features → the data is three-dimensional
- n features → the data is n-dimensional


```{figure} figures/dimensionality.*
:label: fig-dimensionality
:alt: A visual representation of one-dimensional, two-dimensional and three-dimensional data.

One-dimensional, two-dimensional and three-dimensional data.
Source: @gleeson2017
```

## The Curse of Dimensionality
As the number of features (dimensions) in a dataset increases, the data becomes harder to work with and understand.

In high-dimensional spaces:

- Data is difficult to visualize;
- The volume of the space increases so fast that the available data becomes sparse;
- Many features may be redundant or uninformative;
- ML models often require exponentially more data to generalize well.

These issues are known as the *curse of dimensionality*.


## Enter: PCA
To address the curse of dimensionality, we need a way to reduce the number of features while keeping the most important information in the data.

Principal Component Analysis (PCA) achieves this by constructing a smaller set of new features that summarize the original data, allowing us to represent the same information in fewer dimensions without significant loss of information.

```{figure} figures/pca-1.*
:label: fig-pca-1
:alt: Figure of PCA

Dimensionality reduction with PCA.
Source: @vutukuri2023
```

Before we can understand how PCA works, we first need to review some essential mathematical concepts from linear algebra and statistics. These foundations are covered in the next chapter.


+++
