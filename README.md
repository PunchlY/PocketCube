# PocketRubik

## 快速开始

```
npm install pocketcube
```

```js
const Rubik = require('pocketcube');
const Turn = Rubik.Turn;
// const { Rubik, Turn } = require('pocketcube');

const rubik = new Rubik(0);
rubik.action(Turn.R[0]);
rubik.action(Turn.U[2], Rubik.Turn.B[1]);
rubik.do(`RF2U'`);
```

解魔方:

```js
const Rubik = require('pocketcube/solve');

const rubik = new Rubik();
rubik.do(`RF2U'B2LBD2L'`);
rubik.solve(); // ULUL'F'U2F2L2
rubik.solve(0); // URFU'R'F2R2U2

new Rubik().do(`D2RF'U2B'`).solve(0); // FR2FU'F2
```
## 准备

### 状态

见[Wikipedia/Pocket_Cube#Permutations](https://en.wikipedia.org/wiki/Pocket_Cube#Permutations)(zh:[维基百科/二阶魔方#变化](https://zh.wikipedia.org/wiki/%E4%BA%8C%E9%98%B6%E9%AD%94%E6%96%B9#%E5%8F%98%E5%8C%96)).

> `8`个角块的位置均可进行任意互换(`8!`种状态), 如果以一个角块不动作为参考角块, 其他`7`个角块都能任意转换方向(即`37`种状态)(注: 这里指的转换方向, 或者说翻转, 是指一个角块从例如`白-红-绿`变成`绿-白-红`但是一次翻转一定会翻转到`3`个角块). 如果在空间中旋转则不计算方向不同而状态相同的魔方, 实际上的准确状态数还应除以`8`. 所以二阶魔方的总状态数为:
>
> $${\frac{8!\ 3^{7}}{24}}=7!\ 3^{6}=3,674,160$$

本项目中的状态与Wiki中的有些许不同: 在空间中旋转不忽略方向不同而状态相同的魔方.

即总状态数为: 

$${8!\ 3^7}=88,179,840$$

### 状态数(position)

为了给所有状态一个固定的"`id`", 这里定义了`8`个角块的位置与`8`个角块的旋转的排列(状态)到状态数的映射.

#### 定义

##### 编号

对于一个初始魔方, 使用`x` `y` `z`三个自由度定义角块的编号. 偏向右手的块其`x`值规定为`1`(偏向左手的块其`x`值规定为`0`), 位于底层的块其`y`值规定为`1`(位于顶层的块其`y`值规定为`0`), 朝向前的块其`z`值规定为`1`(朝向后的块其`z`值规定为`0`). 并以`x` `y` `z`顺序转换为一个二进制数.

##### 旋转量

对于一个初始魔方, 每个角块只考虑其的一个面, 这里取顶面与底面, 并记作`A`面. 对于任意魔方, 角块的旋转量可以用三个值表示. 若此角块的`A`面位于顶面或底面, 其旋转量记为`0`; `A`面若以魔方的几何中心到此角块的顶点为旋转轴顺时针(反方向)旋转$\frac{2}{3}\pi$后位于顶面或底面, 则记为`1`; `A`面若以魔方的几何中心到此角块的顶点为旋转轴逆时针(正方向)旋转$\frac{2}{3}\pi$后位于顶面或底面, 则记为`2`

##### 实例

初始魔方的编号与旋转量为`[[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]`.

将初始魔方用`R`公式旋转后的编号与旋转量为`[[0, 5, 2, 1, 4, 7, 6, 3], [0, 1, 0, 2, 0, 2, 0, 1]]`.

#### 映射

将编号与旋转量用一个方法转换为状态数, 保证任意魔方有且仅有唯一的状态数:

##### [C[], T[]] -> position

```js
const list = [8];
position = T.slice(0, -1).reduceRight((p, c) => p * 3 + c, C.reduceRight((p, c, i) => {
    const o = list.findIndex((v) => c < v);
    list.splice(o, 0, c);
    return p * (8 - i) + o;
}, 0));
```

##### position -> [C[], T[]]

```js
C = [], T = [];
T.push((3 - Array.from({ length: 7 }).reduce((p, c) => {
    T.push(c = position % 3);
    position = ~~(position / 3);
    return p + c;
}, 0) % 3) % 3);
Array.from({ length: 8 }).forEach(function (_, i) {
    T.push(this.splice(position % (8 - i), 1)[0]);
    position = ~~(position / (8 - i));
}, Array.from({ length: 8 }).map((v, i) => i));
```

##### 实例

初始魔方的状态值为`0`.

将初始魔方用`"R"`公式旋转后的状态值为`77350359`.

### 复合

类似矩阵乘法.

```js
C2 = [], T2 = [];
C1.forEach((n, i) => {
    C2[i] = C0[n];
    T2[i] = (T0[n] + T1[i]) % 3;
});
```

### 基本状态

定义`X_0` `Y_0` `Z_0`, 状态值分别为`36822425` `51565086` `17954269`.

存在集合`C`, 满足:

$$X_0,Y_0,Z_0\in C\\
\forall C_i,\exists C_j,C_k,C_i=C_jC_k$$

`C`中所有元素被称为基本状态.

记`C_0`为状态数为`0`的魔方, 显然其为`C`的元素.

用类似的方法定义`X`:

$$X_0\in X\\
\forall X_i,\exists X_j,X_k,X_i=X_jX_k$$

等效的定义:
$$\begin{aligned}
X_1=2X_0=2{X_0}^{-1}\\
X_2=3X_0={X_0}^{-1}\\
X=\left\{X_0,X_1,X_2\right\}\\
\end{aligned}$$

`Y` `Z`类似.

### 逆

`P` `Q`两个魔方若满足以下:

$$PQ=C_0$$

则表示`P`为`Q`的逆, 或`Q`为`P`的逆:

$$P=Q^{-1}\Leftrightarrow P^{-1}=Q$$

复合的逆:

$$\left(PQ\right)^{-1}=Q^{-1}P^{-1}$$

逆的逆:

$$\left(P^{-1}\right)^{-1}=P$$

### 基本旋转

定义`R_0`, 其状态值为`77350359`.

定义`R`, 方法与`X`类似.

定义`L`:

$$\forall L_i\in L,\forall R_i\in R,L_i=X_0R_i{X_0}^{-1}$$

定义`U`:

$$\forall U_i\in U,\forall R_i\in R,U_i=X_0R_i{X_0}^{-1}$$

定义`F` `B` `D`:
...

定义`T`为`X` `Y` `Z` `R` `U` `F` `L` `D` `B` 的并.

`T`中所有元素被称为基本旋转.

### 镜像

记`_P`为`P`的镜像.

定义:

$$\overline{X_0}=X_0\\
\overline{Y_0}={Y_0}^{-1}\\
\overline{Z_0}={Z_0}^{-1}\\
\overline{R_0}={L_0}^{-1}\\
\overline{U_0}={D_0}^{-1}\\
\overline{F_0}={B_0}^{-1}$$

复合的镜像:

$$\overline{PQ}=\overline{P}\ \overline{Q}$$

镜像的镜像:

$$\overline{\overline{P}}=P$$


### 相似&全等

## api

### Rubik

#### new Rubik(position)

初始化一个魔方.

`position`是`Rubik`实例的状态值.

`position`是一个小于`88179840`的非负`number`, 默认值为`0`.

#### Rubik.prototype.position

返回当前状态值, 值为小于`88179840`的非负`number`.

#### Rubik.prototype.copy()

此方法将返回新的`Rubik`实例, 新的`Rubik`的状态值将与原`Rubik`的状态值相同.

#### Rubik.prototype.action(...rubiks)

执行旋转或复合旋转(状态).

```js
const rubik = new Rubik();
rubik.action(Turn.R[0]);
rubik.action(Turn.U[2], Turn.B[1]);
rubik.action(new Rubik(123));
rubik.action(new Rubik().action(Turn.R[0]));
```

#### Rubik.prototype.do(str)

公式旋转.

```js
const rubik = new Rubik();
rubik.do(`RF2U'`);
rubik.do(`R'`).do(`F2'`);
```

#### Rubik.prototype.isReinstated()

检测是否复原.

```js
new Rubik().do(`R'`).isReinstated(); // false
new Rubik().do(Turn.C[10]).isReinstated(); // true
```

#### Rubik.prototype.solve(t)

解魔方.

```js
const Rubik = require('pocketcube/solve');
new Rubik().do(`R'`).solve(); // R
new Rubik().do(`FU'BU'RU'F2DR'BRU'L'UR2`).solve(); // F'LDF'D2FDL2F
new Rubik().do(`FU'BU'RU'F2DR'BRU'L'UR2`).solve(0); // F'RFU'F2UFR2U'
new Rubik().do(`FU'BU'RU'F2DR'BRU'L'UR2`).solve(-1); // B'DBD'L2DBD2L'
new Rubik().do(`FU'BU'RU'F2DR'BRU'L'UR2`).solve(0b00000010110); // U'LDF'L2FRU2F'
```

### Turn

#### Turn.C
为`Turn`实例的长度为`24`的数组, 其元素定义为魔方在空间中不同位置(朝向)的状态.

#### Turn.R
为`Turn`实例的数组, 其元素分别定义为`"R"`旋转, `"R2"`旋转, `"R'"`旋转.

本质为`Turn.C[0]`执行`"R"`(`"R2"`, `"R'"`)旋转后的状态.

#### Turn.U
类似[Turn.R](#Turn.R)

#### Turn.F
类似[Turn.R](#Turn.R)

#### Turn.L
类似[Turn.R](#Turn.R)

#### Turn.D
类似[Turn.R](#Turn.R)

#### Turn.B
类似[Turn.R](#Turn.R)

#### Turn.X
类似[Turn.R](#Turn.R)

#### Turn.Y
类似[Turn.R](#Turn.R)

#### Turn.Z
类似[Turn.R](#Turn.R)

## License

```
        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  1. You just DO WHAT THE FUCK YOU WANT TO.
```