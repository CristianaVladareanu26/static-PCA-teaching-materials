(covariance-matrix)=
# The Covariance Matrix

The *covariance matrix* describes how every pair of features in a dataset varies together.

For a dataset with $d$ features, the covariance matrix is a $d \times d$ matrix where each entry measures the covariance between two features.

---

## Definition

For features $x^{(i)}$ and $x^{(j)}$, the entry in the covariance matrix is:

$$
\mathbf{C}_{ij} = \mathrm{cov}(x^{(i)}, x^{(j)})
$$

where:

- diagonal entries ($i = j$) represent the variance of a single feature  
- off-diagonal entries ($i \neq j$) represent how two different features vary together  

---

## Matrix

For a dataset with features $x_1, x_2, \dots, x_d$, the covariance matrix looks like:

$$
\mathbf{C} =
\begin{bmatrix}
\mathrm{var}(x_1) & \mathrm{cov}(x_1, x_2) & \cdots & \mathrm{cov}(x_1, x_d) \\
\mathrm{cov}(x_2, x_1) & \mathrm{var}(x_2) & \cdots & \mathrm{cov}(x_2, x_d) \\
\vdots & \vdots & \ddots & \vdots \\
\mathrm{cov}(x_d, x_1) & \mathrm{cov}(x_d, x_2) & \cdots & \mathrm{var}(x_d)
\end{bmatrix}
$$

---

## Interpretation

The covariance matrix summarizes the structure of a dataset:

- Large positive values → features increase together  
- Large negative values → one feature increases while the other decreases  
- Values near zero → weak or no linear relationship  

The diagonal shows how much each feature varies individually, while the off-diagonal terms show how features relate to each other.

---

## Key take-away

The covariance matrix captures all *linear relationships* between features in a dataset in a single object.
