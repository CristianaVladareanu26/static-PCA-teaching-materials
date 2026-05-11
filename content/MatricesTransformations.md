# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.

```{raw} html
<div align="center">
  <video width="80%" controls>
   <source src="../_static/lineartransform1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <p><em> Visual intuition of linear transformations. Source: <span class="cite" data-caption="true">{cite}`3blue1brown2016`</span></em></p>
</div>
```

## What is a matrix transformation?
