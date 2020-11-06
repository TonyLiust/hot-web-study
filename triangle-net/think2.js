
class Edge {
  constructor(p1, p2, c) {
    this.left = p1;
    this.right = p2;
    this.count = c;
  }
}
class Triangle {
  constructor(ps, es, x, y, r) {
    //三角形的三个顶点
    this.ps = ps;
    //三角形的三条边
    this.es = es;
    this.xc = x; //三角形外接圆圆心的x坐标
    this.yc = y; //三角形外接圆圆心的y坐标
    this.r = r; //三角形外接圆的半径
  }
}
class delaunayTriangleNet {
  constructor() {
    var m_Pts = [], m_Edges = [], m_Tris = [];
    this.ctx = null;
    this.init = function (ctx,p1, p2, p3, p4) {
      this.ctx = ctx;
      m_Pts = [];
      m_Pts.push(...[p1, p2, p3, p4]);
      m_Edges.push(...[new Edge(0, 1, -1), new Edge(1, 2, -1), new Edge(0, 3, -1), new Edge(2, 3, -1)]);
      MakeTriangle(0, 1, 2);
      MakeTriangle(0, 2, 3);
    };
    this.Delete_Frame = function () {
      for (var i = 0; i < 4; i++)
        m_Pts.splice(0, 1);
      for (var i = 0; i < m_Tris.length; i++) {
        if (m_Tris[i].ps[0] == 0 || m_Tris[i].ps[0] == 1 || m_Tris[i].ps[0] == 2 || m_Tris[i].ps[0] == 3) {
          DelTriangle(i);
          i--;
        }

        else {
          for (var j = 0; j < 3; j++) {
            m_Tris[i].ps[j] -= 4;
            m_Tris[i].es[j].left -= 4;
            m_Tris[i].es[j].right -= 4;
          }
        }
      }
      for (var i = 0; i < 4; i++)
        m_Edges.splice(0, 1);
      for (var i = 0; i < m_Edges.length; i++) {
        m_Edges[i].left -= 4;
        m_Edges[i].right -= 4;
      }
    };
    this.Boundary_Recover = function (fromPoint, toPoint) {
      var BoundEdges = [];
      for (var i = 0; i < m_Tris.length; i++) {
        if (m_Tris[i].ps[0] >= (fromPoint - 1) && m_Tris[i].ps[2] <= (toPoint - 1)) {
          BoundEdges = DelTriangle(i);
          i--;
        }
      }
    };
    this.render = function () {
      var m = m_Tris.length;
      this.ctx.save();
      this.ctx.beginPath();
      for (var i = 0; i < m; i++) {
        var t = m_Tris[i];
        var p0 = m_Pts[t.ps[0]], p1 = m_Pts[t.ps[1]], p2 = m_Pts[t.ps[2]];
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p0.x, p0.y);
      }
      this.ctx.stroke();
    };
    this.AddPoint = function (ps) {
      for (var k = 0; k < ps.length; k++) {
        var p = ps[k];
        m_Pts.push(p);
        var badTriangle = [], BoundEdges = [], temps = [], polygon = [];
        var triCount = m_Tris.length;
        for (var i = 0; i < triCount; i++) //通过循环找到所有不符合空圆规则的三角形，并将其索引号存在badTriangle中 
        {
          if (inCircle(p, m_Tris[i])) {
            //badTriangle.push(i);
            BoundEdges.push(...m_Tris[i].es);
          }
          else {
            temps.push(m_Tris[i]);
          }
        }
        // 检查重复的边，重复的则删除
        edgesLoop: for (var ilen = BoundEdges.length, i = 0; i < ilen; i++) {
          var edge = BoundEdges[i];
          // 辺重复的则删除
          for (var jlen = polygon.length, j = 0; j < jlen; j++) {
            if (edge.left == polygon[j].left && edge.right == polygon[j].right) {
              polygon.splice(j, 1);
              continue edgesLoop;
            }
          }
          polygon.push(edge);
        }
        var PtSize = m_Pts.length;
        for (ilen = polygon.length, i = 0; i < ilen; i++) {
          edge = polygon[i];
          var newTriangle = MakeTriangle(edge.left, edge.right, PtSize - 1);
          temps.push(newTriangle);
        }
        m_Tris = temps;
        // for (var i=0;i<badTriangle.length;i++)//通过循环删除所有不符合空圆规则的三角形，同时保留边框 
        // { 
        //     var _boundEdges = DelTriangle(badTriangle[i]); 
        //     BoundEdges.push(..._boundEdges);
        //     for (var j=i+1;j<badTriangle.length;j++) badTriangle[j]-=1; 
        // }
        // var PtSize= m_Pts.length;//获得目前的点数 
        // console.log(`add point generat ${BoundEdges.length} edges`);
        // var newTriangle;
        // for (var i=0;i< BoundEdges.length;i++)//生成新的三角形 
        // { 
        //     if (PtSize-1<BoundEdges[i].left) {
        //       newTriangle = MakeTriangle(PtSize-1,BoundEdges[i].left,BoundEdges[i].right); 
        //     }
        //     else if (PtSize-1>BoundEdges[i].left && PtSize-1<BoundEdges[i].right) {
        //       newTriangle = MakeTriangle(BoundEdges[i].left,PtSize-1,BoundEdges[i].right); 
        //     } 
        //     else 
        //     {
        //       newTriangle = MakeTriangle(BoundEdges[i].left,BoundEdges[i].right,PtSize-1);
        //     }
        // }
      }
    };
    function Cal_Centre(p1, p2, p3) {
      var x1, x2, x3, y1, y2, y3;
      x1 = m_Pts[p1].x;
      y1 = m_Pts[p1].y;
      x2 = m_Pts[p2].x;
      y2 = m_Pts[p2].y;
      x3 = m_Pts[p3].x;
      y3 = m_Pts[p3].y;
      var x_centre = ((y2 - y1) * (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1) - (y3 - y1) * (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1)) / (2 * (x3 - x1) * (y2 - y1) - 2 * ((x2 - x1) * (y3 - y1))); //计算外接圆圆心的x坐标 
      var y_centre = ((x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1) - (x3 - x1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)) / (2 * (y3 - y1) * (x2 - x1) - 2 * ((y2 - y1) * (x3 - x1))); //计算外接圆圆心的y坐标 
      var radius = Math.sqrt((x1 - x_centre) * (x1 - x_centre) + (y1 - y_centre) * (y1 - y_centre)); //计算外接圆的半径
      return [x_centre, y_centre, radius];
    }
    function MakeTriangle(p1, p2, p3) {
      var [x_centre, y_centre, radius] = Cal_Centre(p1, p2, p3);
      var newTriangle = new Triangle([p1, p2, p3], [new Edge(p1, p2, 1), new Edge(p2, p3, 1), new Edge(p1, p3, 1)], x_centre, y_centre, radius);
      m_Tris.push(newTriangle);
      // var EdgeSzie= m_Edges.length;//获得目前的边数 
      // var flag; 
      // for (var i=0;i<3;i++) 
      // { 
      //     flag=1; 
      //     for(var j=0;j<EdgeSzie;j++)//通过循环判断新构造的三角形的各边是否已经存在于m_Edges中，如果存在则只增加该边的计数，否则添加新边 
      //     { 
      //         if (newTriangle.es[i].left == m_Edges[j].left&&newTriangle.es[i].right == m_Edges[j].right && m_Edges[j].count!=-1) 
      //         {
      //           flag=0;
      //           m_Edges[j].count+=1;
      //           break;
      //         } 
      //         else if(newTriangle.es[i].left == m_Edges[j].left&&newTriangle.es[i].right == m_Edges[j].right && m_Edges[j].count == -1)
      //         {
      //           flag=0;
      //           break;
      //         } 
      //     } 
      //     if (flag==1) m_Edges.push(newTriangle.es[i]); 
      // }
      return newTriangle;
    }
    function inCircle(p, currentTris) {
      var dis = Math.sqrt((currentTris.xc - p.x) * (currentTris.xc - p.x) + (currentTris.yc - p.y) * (currentTris.yc - p.y));
      if (dis > currentTris.r)
        return false;
      else
        return true;
    }
    function DelTriangle(n) {
      var BoundEdges = [];
      for (var i = 0; i < 3; i++) {
        var mecount = m_Edges.length;
        for (var j = 0; j < mecount; j++) {
          if (m_Edges[j].left == m_Tris[n].es[i].left && m_Edges[j].right == m_Tris[n].es[i].right) {
            if (m_Edges[j].count == 2) //若要删除三角形的一边的计数为2，则将其计数减1，并将其压入BoundEdges容器中 
            {
              m_Edges[j].count = 1;
              BoundEdges.push(m_Edges[j]);
            }
            else if (m_Edges[j].count == -1)
              BoundEdges.push(m_Edges[j]); //如果是外边框，则直接压入BoundEdges容器中 
            else if (m_Edges[j].count == 1) //如果删除三角形的一边的计数为1，则删除该边，同时查看BoundEdges中是否有此边，若有，则删除 
            {
              var becount = BoundEdges.length;
              for (var k = 0; k < becount; k++) {
                if (BoundEdges[k].left == m_Edges[j].left && BoundEdges[k].right == m_Edges[j].right) {
                  BoundEdges.splice(k, 1);
                  break;
                }
              }
              m_Edges.splice(j, 1);
              j--;
            }
            break;
          }
        }
      }
      m_Tris.splice(n, 1); //删除该三角形 
      return BoundEdges;
    }

  }
};

var vm = new Vue({
  el: '#app',
  data() {
    return {
      canvas: null,
      ctx: null,
      hitPointIndex: -1,
      points: [],
      h:400,
      w:600,
      mouseTarget: {x:0,y:0},
      mousePos:{x:0,y:0},
    }
  },
  mounted(){
    this.canvas = this.$refs.canvas;
    this.canvas.width = this.w = 800;
    this.canvas.height = this.h = 600;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.onmousedown = this.onmouseDown;
    this.canvas.onmouseup = (e) => {
      this.hitPointIndex = -1;
    }
    this.canvas.onmousemove = this.onmouseMove;
    this.createPoints(50);
    this.renderPoint();
    this.createTriangleNet();
    requestInterval(this.update, 0);
  },
  methods: {
    clear() {
      this.points = [];
      this.ctx.clearRect(0,0,this.w,this.h);
    },
    add1() {
      this.createPoints(1);
    },
    add3() {
      this.createPoints(3);
    },
    add100() {
      this.createPoints(100);
    },
    createPoints(n) {
      for(var i=0; i<n; i++){
        var cx = Math.floor(Math.random() * this.w);
        var cy = Math.floor(Math.random() * this.h);
        this.points.push({x:cx,y:cy});
      }
    },
    createTriangleNet() {
      var _poins = [];
      //console.time("triangulate");
      _poins.push(...[{x:0,y:0},{x:this.w,y:0},{x:this.w,y:this.h},{x:0,y:this.h}])
      var delaunay = new delaunayTriangleNet();
      delaunay.init(this.ctx,_poins[0],_poins[1],_poins[2],_poins[3]);
      // var _poins2 = points.splice(4);
      delaunay.AddPoint(this.points);
      //console.timeEnd("triangulate");
      delaunay.Delete_Frame();
      delaunay.render();
    },
    getEventPosition(ev){
      var x, y;
      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
      }
      return {x: x, y: y};
    },
    onmouseDown(e) {
      var p = this.getEventPosition(e);
      for (i = 0; i < this.points.length; i ++) {
        var dot = this.points[i];
        var dis = Math.sqrt((p.x - dot.x) * (p.x - dot.x) + (p.y - dot.y) * (p.y - dot.y));//Math.sqrt()求平方跟
        if(dis <= 5){
          this.hitPointIndex = i;
          break;
        }
      }
    },
    onmouseMove(e) {
      var rect = this.canvas.getBoundingClientRect();
      this.mouseTarget.x = e.clientX - rect.left;
      this.mouseTarget.y = e.clientY - rect.top;
    },
    updateMousePos(){
      this.mousePos.x += (this.mouseTarget.x-this.mousePos.x)/10;
      this.mousePos.y += (this.mouseTarget.y-this.mousePos.y)/10;
      if(this.hitPointIndex > 0) {
        this.points[this.hitPointIndex].x = this.mousePos.x;
        this.points[this.hitPointIndex].y = this.mousePos.y;
      }
    },
    update() {
      this.ctx.clearRect(0,0,this.w,this.h);
      this.updateMousePos();
      this.renderPoint();
      this.createTriangleNet();
    },
    renderPoint() {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = "#ff0000";
      this.ctx.strokeStyle = "#ff0000";
      for(var i=0; i<this.points.length; i++){
        var cx = this.points[i].x;
        var cy = this.points[i].y;
        this.ctx.moveTo(cx,cy);
        this.ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      }
      this.ctx.fill();
    }
  }
});