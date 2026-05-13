# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.

---
Watch the video below to understand the intuition behind linear transformations. Source: {cite}`3blue1brown2016

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/kYB8IZa5AuE?si=05H1OiuydGVIlaiy&start=77&end=134"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>
---

## What is a matrix transformation?

A matrix transformation is a specific type of linear transformation that can be represented using matrix multiplication.
It turns out that *every* linear transformation from an $n$-dimensional space to an $m$-dimensional space can be perfectly described by an $m \times n$ matrix $A$, such that:

$$
T(\mathbf{x}) = A\mathbf{x}
$$

This means every input vector x is transformed by multiplying it with a matrix A.

**Geometrically**, to understand what a specific matrix does to a dataset, you only need to ask one question: **Where do the basis vectors go?**
Once you know where the basis vectors go, every other vector is determined automatically, since it can be written as a linear combination of the standard basis vectors.

```{tip} What are basis vectors again?
:class: dropdown
:open: false
:icon: false
In a standard 2D Cartesian coordinate system, every vector can be described as a combination of two special unit vectors, called the **basis vectors**:
*   $\hat{i}$ (i-hat): The vector pointing 1 unit right along the x-axis, $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$.
*   $\hat{j}$ (j-hat): The vector pointing 1 unit up along the y-axis, $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$.
```

---
Watch the video below to see how matrix columns determine where the basis vectors go, and how all other vectors follow from linear combinations of those basis vectors. Source: {cite}`3blue1brown2016

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/kYB8IZa5AuE?si=05H1OiuydGVIlaiy&start=204&end=337"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>
---

## Common Matrix Transformations

