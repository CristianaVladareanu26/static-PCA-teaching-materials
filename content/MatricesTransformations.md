# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.


<iframe width="560" height="315" src="https://www.youtube.com/embed/kYB8IZa5AuE?si=xepAftdaOcYbt3Wd&start=60&end=135" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## What is a matrix transformation?
