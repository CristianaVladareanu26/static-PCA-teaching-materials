# Matrices and Transformations

## What is a linear transformation?

A **transformation** (or function) $T$ takes an input vector $\mathbf{x}$ and assigns it to an output vector $T(\mathbf{x})$.

A transformation is **linear** if it satisfies two algebraic rules for all vectors $\mathbf{u}, \mathbf{v}$ and any scalar $c$:

1.  **Preserves addition:** $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$
2.  **Preserves scalar multiplication:** $T(c\mathbf{u}) = cT(\mathbf{u})$

**Geometrically**, a transformation is linear if it keeps grid lines parallel and evenly spaced, and leaves the origin $(0,0)$ fixed in place. It essentially keeps the space "flat" without curving it.


---
Visual intuition of linear transformations. Source: {cite}`3blue1brown2016

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/kYB8IZa5AuE?si=05H1OiuydGVIlaiy&start=77&end=134"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        src="https://www.youtube.com/embed/kYB8IZa5AuE?si=05H1OiuydGVIlaiy&start=77;end=134"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>

---
## What is a matrix transformation?
