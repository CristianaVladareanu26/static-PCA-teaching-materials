# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.


```{figure} figures/lineartransform1.mp4
:alt: Visual intuition of linear transformations
:width: 80%
:align: center

Visual intuition of linear transformations. Source: {cite}`3blue1brown2016`
```

<div align="center">
  <video width="80%" controls>
    <source src="https://raw.githubusercontent.com/cristianavladareanu26/multimodal-PCA-teaching-materials/main/figures/lineartransform1.mp4" type="video/mp4">
  </video>
  <br>
  <em>Visual intuition of linear transformations. Source: <span class="cite" data-caption="true">{cite}`3blue1brown2016`</span></em>
</div>


## What is a matrix transformation?
