# Linear Algebra 

This section revisits the essential concepts from linear algebra required to understand PCA.

## Vectors

### What is a vector?
A vector can be understood in two complementary ways: as an ordered list of numbers or as a geometric object in space.

In ML, a **feature vector** is an ordered list of values, where each entry represents a feature of the object:
\begin{bmatrix}
x_1 \\
x_2 \\
\vdots \\
x_n
\end{bmatrix}

Each coordinate  $x_i$ represents the value of the object for one specific feature.

Geometrically, the same vector can be interpreted as a point (or arrow) in an n-dimensional space, where each axis corresponds to one feature. In this space, the feature vector describes the object’s position based on its feature values.

```{figure} figures/vectors.*
:label: fig-vectors
:alt: Algebraic vs. geometric view of a vector.

Algebraic vs. geometric representation of a vector.
Source: @duda1997
```

### Dot product

The **dot product** is an operation that takes two vectors and returns a single number (a scalar). It measures how much two vectors point in the same direction.

For two vectors:

$$
\begin{bmatrix}
a_1 \\
a_2 \\
\vdots \\
a_n
\end{bmatrix}
\quad \text{and} \quad
\begin{bmatrix}
b_1 \\
b_2 \\
\vdots \\
b_n
\end{bmatrix}
$$

the dot product is defined as:

$$
\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^{n} a_i b_i
$$

or explicitly:

$$
\mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + \cdots + a_n b_n
$$

---

```{admonition} Example: Dot product in 2D
:class: dropdown

Let:

$$
\mathbf{a} =
\begin{bmatrix}
2 \\
3
\end{bmatrix},
\quad
\mathbf{b} =
\begin{bmatrix}
4 \\
1
\end{bmatrix}
$$


Compute the dot product:

$$
\mathbf{a} \cdot \mathbf{b} = (2 \cdot 4) + (3 \cdot 1)
$$

$$
= 8 + 3 = 11
$$

So, the dot product is **11**.
```

### Orthogonality


Two vectors are **orthogonal** if their dot product is equal to zero. This means they are perpendicular to each other in geometric space.

For two vectors:

$$
\mathbf{a} \cdot \mathbf{b} = 0 \quad \Rightarrow \quad \mathbf{a} \perp \mathbf{b}
$$

---

```{admonition} Example: Orthogonal vectors
:class: dropdown

Let:

$$
\mathbf{a} =
\begin{bmatrix}
1 \\
2
\end{bmatrix},
\quad
\mathbf{b} =
\begin{bmatrix}
2 \\
-1
\end{bmatrix}
$$

Compute the dot product:

$$
\mathbf{a} \cdot \mathbf{b} = (1 \cdot 2) + (2 \cdot -1)
$$

$$
= 2 - 2 = 0
$$

Since the dot product is zero, the vectors are **orthogonal**.
```

### Projection

Projection describes how much of one vector lies in the direction of another vector. Geometrically, it can be seen as the “shadow” of a vector when it is projected onto another vector.

There are two related forms of projection: **scalar projection** and **vector projection**. The scalar projection is derived from the vector projection and represents only the *length* of the projection. The vector projection, on the other hand, gives the *full projected vector*, including both direction and magnitude.

The scalar projection of **a** onto **b** is:

$$
s = \|\mathbf{a}\| \cos(\theta) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|}
$$

The vector projection of **a** onto **b** is:

$$
\text{proj}_{\mathbf{b}}(\mathbf{a}) = \|\mathbf{a}\| \cos(\theta)\,\frac{\mathbf{b}}{\|\mathbf{b}\|} = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|^2} \mathbf{b}
$$

```{figure} figures/projection.*
:label: fig-projection
:alt: Vector projection

Projection of vector **a** onto vector **b**.
Source: @projection
```


## Matrices and Linear Transformations

### What is a linear transformation? 

### Transforming data with matrices

### Eigenvectors and eigenvalues


(Reference: 3Blue1Brown video)
