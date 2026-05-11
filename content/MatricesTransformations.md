# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.

```{figure} [https://youtu.be/kYB8IZa5AuE?start=77&end=134](https://youtu.be/kYB8IZa5AuE?start=77&end=134)
:target: [https://youtu.be/kYB8IZa5AuE?start=77&end=134](https://youtu.be/kYB8IZa5AuE?start=77&end=134)
:alt: Linear transformations and matrices | Chapter 3, Essence of linear algebra
:align: center

*Click to watch: 3Blue1Brown's visual intuition of linear transformations.
