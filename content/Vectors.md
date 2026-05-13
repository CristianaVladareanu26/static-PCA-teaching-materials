# Vectors

## What is a vector?
A vector can be understood in two complementary ways: as an ordered list of numbers or as a geometric object in space.

In ML, a *feature vector* is an ordered list of values, where each entry represents a feature of the object:
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

(dot-product)=
## Dot product
The *dot product* of two vectors is a scalar obtained by multiplying corresponding components and summing the results. Beyond its algebraic definition, it has an important geometric meaning:
**The dot product measures how much one vector points in the direction of another.**

---
Watch the video below to understand the geometrical intuition behind the dot product. 
Source: @3blue1brown2016-2

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/kYB8IZa5AuE?si=05H1OiuydGVIlaiy&start=84&end=130&cc_load_policy=1"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>

---

(dot-prod-unit)=
```{tip} Dot Product with a Unit Vector
:class: dropdown
:open: true
:icon: true
If $\mathbf{u}$ is a unit vector (meaning $\|\mathbf{u}\| = 1$), then

$$
\mathbf{a} \cdot \mathbf{u} = \|\mathbf{a}\|\cos(\theta)
$$

This quantity has a special meaning:

The dot product of a vector with a unit vector gives the length of the component of that vector in the direction of the unit vector.

In other words, it tells us how far the vector extends along that direction.
```

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
:open: false

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

(projection)=
## Projection
The projection of one vector onto another describes the component of the first vector that lies in the direction of the second. Geometrically, it can be seen as the “shadow” of a vector when it is projected onto another vector.


There are two related forms of projection: **scalar projection** and **vector projection**. The scalar projection is derived from the vector projection and represents only the *length* of the projection. The vector projection, on the other hand, gives the *full projected vector*, including both direction and magnitude.

The scalar projection of **a** onto **b** is:

$$
s = \|\mathbf{a}\| \cos(\theta) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|}
$$

The vector projection of **a** onto **b** is:

$$
\text{proj}_{\mathbf{b}}(\mathbf{a}) = \|\mathbf{a}\| \cos(\theta)\,\frac{\mathbf{b}}{\|\mathbf{b}\|} = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|^2} \mathbf{b}
$$

(projection-unit)=
```{tip} Projection onto a Unit Vector
:class: dropdown
:open: true
:icon: true
If $\mathbf{u}$ is a unit vector (meaning $\|\mathbf{u}\| = 1$), the vector projection simplifies to:

$$
\operatorname{proj}_{\mathbf{u}}(\mathbf{a}) = (\mathbf{a} \cdot \mathbf{u})\,\mathbf{u}
$$

This works because dividing by $\|\mathbf{u}\|^2$ is unnecessary when $\|\mathbf{u}\| = 1$.

In this case, the dot product $\mathbf{a} \cdot \mathbf{u}$ directly gives the scalar projection, and multiplying by $\mathbf{u}$ converts it into the full projected vector.
```



```{figure} figures/projection.*
:label: fig-projection
:alt: Vector projection

Projection of vector **a** onto vector **b**.
Source: @projection
```
