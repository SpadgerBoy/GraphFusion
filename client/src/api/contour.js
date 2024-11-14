/*
* @Author: wakouboy
* @Date:   2018-08-26 19:08:28
* @Last Modified by:   wakouboy
* @Last Modified time: 2018-08-26 19:18:11
*/
var FLOATINGPOINT_EPSILON = 0.00001;
var calContour = function (nodes, padding, curvature) {
    var circles = [];
    nodes.forEach(function(node) {
        // Add circles with radius increased by padding. This generates the spacing between circle and contour.
        circles.push(new Circle(node.x, node.y, node.r + padding))
    });
    // console.log('circles', circles) 
    var outerCircleRing = getOuterCircleRing(circles, curvature);

    var arcs = [];

    var arcs1 = generateCircleArcs(outerCircleRing),
    arcs2 = generateTangentArcs(outerCircleRing, curvature);
    var i = 0
    while (i < arcs1.length * 2) {
        if (i % 2 == 0) {
            arcs.push(arcs2[i / 2])
        } else {
            arcs.push(arcs1[(i - 1) / 2]) 
        }

        i++
    }
    return arcsToPaths(arcs);
}

function Circle(x, y, radius) {
    this.center = new Vec2(x, y);
    this.radius = radius;

    // See: http://paulbourke.net/geometry/circlesphere/
    this.intersects = function(circle) {
        var distance = this.center.distance(circle.center);

        // Circles are to far from each other.
        if (distance > this.radius + circle.radius) return false;
        // One circle is contained in the other.
        if (distance < Math.abs(this.radius - circle.radius)) return false;
        // Circles intersect.
        return true;
    };

    // See: http://paulbourke.net/geometry/circlesphere/
    this.intersectionPoints = function(circle) {
        var P0 = this.center;
        var P1 = circle.center;

        var d = this.center.distance(circle.center);
        var a = (this.radius * this.radius - circle.radius * circle.radius + d * d) / (2 * d);
        var h = Math.sqrt(this.radius * this.radius - a * a);

        var P2 = P1.sub(P0).scale(a / d).add(P0);

        var x3 = P2.x + h * (P1.y - P0.y) / d;
        var y3 = P2.y - h * (P1.x - P0.x) / d;
        var x4 = P2.x - h * (P1.y - P0.y) / d;
        var y4 = P2.y + h * (P1.x - P0.x) / d;

        return [new Vec2(x3, y3), new Vec2(x4, y4)];
    };
}

function Arc(x, y, startAngle, endAngle, radius) {
    this.center = new Vec2(x, y);
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.radius = radius;
}
//vectorize
function Vec2(x, y) {
    this.x = x;
    this.y = y;

    this.distance = function(vec) {
        var deltaX = this.x - vec.x;
        var deltaY = this.y - vec.y;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    };

    this.sub = function(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    };

    this.add = function(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    };

    this.scale = function(scale) {
        return new Vec2(this.x * scale, this.y * scale);
    };

    this.angle = function(vec) {
        var result = Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
        if (result < 0) result += 2 * Math.PI;
        return result;
    }

    this.magnitude = function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    this.toUnitVector = function() {
        return this.scale(1.0 / this.magnitude());
    }
}

function getOuterCircleRing(circles, curvature) {
    // Create deep copy of circles, as they are modified in the next steps.
    //let circlesEnlarged = circles.map(a = > Object.assign({}, a));
    var circlesEnlarged = circles.map(function(a) {
        return Object.assign({},
        a)
    });

    // Add the radius s of the tangent circles to avoid self-intersections.
    circlesEnlarged.forEach(function(circle) {
        circle.radius += curvature;
    });

    // Find index of the leftmost circle.
    var leftmostCircleIndex = 0;
    for (var i = 1; i < circlesEnlarged.length; i++) {
        if (circlesEnlarged[i].center.x - circlesEnlarged[i].radius < circlesEnlarged[leftmostCircleIndex].center.x - circlesEnlarged[leftmostCircleIndex].radius) {
            leftmostCircleIndex = i;
        }
    }

    // Get the outer ring of circles.
    var outerCircleRing = [];
    var index = leftmostCircleIndex;
    var referenceDirection = new Vec2( - 1, 0);
    while (true) {
        var intersection = getNextClockwiseIntersection(index, circlesEnlarged, referenceDirection);
        if (intersection === undefined) break;

        index = intersection.circleIndex;
        var circle = circles[index];
        referenceDirection = intersection.intersectionPoint.sub(circle.center);

        if (outerCircleRing[0] && index === outerCircleRing[0].circleIndex && intersection.intersectionPoint.distance(outerCircleRing[0].intersectionPoint) < FLOATINGPOINT_EPSILON) {
            break;
        }

        outerCircleRing.push({
            'circle': circle,
            'intersectionPoint': intersection.intersectionPoint,
            'circleIndex': index
        });
    }

    return outerCircleRing;
}

function getNextClockwiseIntersection(currentCircleIndex, circleArray, direction) {
    var currentCircle = circleArray[currentCircleIndex];
    var allIntersections = [];

    for (var i = 0; i < circleArray.length; i++) {
        if (! (i === currentCircleIndex)) {
            if (circleArray[i].intersects(circleArray[currentCircleIndex])) {
                var intersectionPoints = circleArray[i].intersectionPoints(circleArray[currentCircleIndex]);
                // Store intersection points and index of corresponding circle
                allIntersections.push({
                    'intersectionPoint': intersectionPoints[0],
                    'circleIndex': i
                });
                allIntersections.push({
                    'intersectionPoint': intersectionPoints[1],
                    'circleIndex': i
                });
            }
        }
    }

    var smallestAngle = 7; // Init with max angle (> 2*PI).
    var intersectionWithSmallestAngle = undefined; // Init as undefined.
    allIntersections.forEach(function(intersection) {
        var angle = direction.angle(intersection.intersectionPoint.sub(currentCircle.center));

        if (angle > FLOATINGPOINT_EPSILON && angle < smallestAngle) {
            smallestAngle = angle;
            intersectionWithSmallestAngle = intersection;
        }
    });

    return intersectionWithSmallestAngle;
}

function generateCircleArcs(outerCircleRing) {
    var arcs = [];

    for (var i = 0; i < outerCircleRing.length; i++) {
        var circle = outerCircleRing[i].circle;
        var firstIntersection = outerCircleRing[i].intersectionPoint;
        var secondIntersection = outerCircleRing[(i + 1) % outerCircleRing.length].intersectionPoint;

        var centerToFirstIntersection = firstIntersection.sub(circle.center);
        var centerToSecondIntersection = secondIntersection.sub(circle.center);
        var arcStartAngle = new Vec2(0, -1).angle(centerToFirstIntersection);
        var arcEndAngle = new Vec2(0, -1).angle(centerToSecondIntersection);

        arcs.push(new Arc(circle.center.x, circle.center.y, arcStartAngle, arcEndAngle, circle.radius));
    }

    return arcs;
}

function generateTangentArcs(outerCircleRing, curvature) {
    var arcs = [];

    for (var i = 0; i < outerCircleRing.length; i++) {
        var intersection = outerCircleRing[i].intersectionPoint;
        var firstCircle = outerCircleRing[(i > 0) ? i - 1 : outerCircleRing.length - 1].circle;
        var secondCircle = outerCircleRing[i].circle;

        var intersectionToFirstCenter = firstCircle.center.sub(intersection);
        var intersectionToSecondCenter = secondCircle.center.sub(intersection);
        var arcEndAngle = new Vec2(0, -1).angle(intersectionToFirstCenter);
        var arcStartAngle = new Vec2(0, -1).angle(intersectionToSecondCenter);

        arcs.push(new Arc(intersection.x, intersection.y, arcStartAngle, arcEndAngle, curvature));
    }

    return arcs;
}

function arcsToPaths(arcs) {
    var paths = [];
    var arcGen = d3.arc();

    arcs.forEach(function(arc) {
        var startAngleTemp = arc.startAngle;

        if (startAngleTemp > arc.endAngle) {
            startAngleTemp -= 2 * Math.PI;
        }

        var start = polarToCartesian(arc.center.x, arc.center.y, arc.radius, arc.endAngle);
        var end = polarToCartesian(arc.center.x, arc.center.y, arc.radius, startAngleTemp);

        var largeArcFlag = arc.endAngle - startAngleTemp <= 180 ? "0": "1";

        var d = ["L", start.x, start.y, "A", arc.radius, arc.radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");

        paths.push(d)
        // paths.push({
        //     d: arcGen({
        //         innerRadius: arc.radius,
        //         outerRadius: arc.radius,
        //         startAngle: startAngleTemp,
        //         endAngle: arc.endAngle
        //     }),
        //     transform: "translate(" + arc.center.x + "," + arc.center.y + ")"
        // });
    });
    var ans = paths.join(' ');
    ans = 'M' + ans.substring(1) 
    return ans
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = angleInDegrees - Math.PI / 2

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}


export {
    calContour
}