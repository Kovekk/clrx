function convertToClrx() {
    // Get the OD SRx
    let sphOD = parseFloat(document.getElementById("sphOD").value);
    let cylOD = parseFloat(document.getElementById("cylOD").value);
    let axisOD = parseFloat(document.getElementById("axisOD").value);

    // Get the OS SRx
    let sphOS = parseFloat(document.getElementById("sphOS").value);
    let cylOS = parseFloat(document.getElementById("cylOS").value);
    let axisOS = parseFloat(document.getElementById("axisOS").value);

    // Calculate new OD and OS CLRx
    const clrxOD = calcContacts(sphOD, cylOD, axisOD);
    const clrxOS = calcContacts(sphOS, cylOS, axisOS);
    const sphEquivOD = calcSphEquiv(clrxOD.sph, clrxOD.cyl);
    const sphEquivOS = calcSphEquiv(clrxOS.sph, clrxOS.cyl);

    // Put new OD CLRx into the awaiting table
    displaySph(document.getElementById("newSphOD"), clrxOD.sph);
    displayCyl(document.getElementById("newCylOD"), document.getElementById("newAxisOD"), clrxOD.cyl, clrxOD.axis);
    displaySphEquiv(document.getElementById("sphEquivOD"), sphEquivOD);

    // document.getElementById("newSphOD").innerHTML = clrxOD.sph;
    // if (!isNaN(clrxOD.cyl)) {
    //     document.getElementById("newCylOD").innerHTML = clrxOD.cyl;
    //     document.getElementById("newAxisOD").innerHTML = clrxOD.axis;
    // }

    // Put new OS CLRx into the awaiting table
    displaySph(document.getElementById("newSphOS"), clrxOS.sph);
    displayCyl(document.getElementById("newCylOS"), document.getElementById("newAxisOS"), clrxOS.cyl, clrxOS.axis);
    displaySphEquiv(document.getElementById("sphEquivOS"), sphEquivOS);
    // document.getElementById("newSphOS").innerHTML = clrxOS.sph;
    // document.getElementById("newCylOS").innerHTML = clrxOS.cyl;
    // document.getElementById("newAxisOS").innerHTML = clrxOS.axis;
}

function calcContacts(sphi, cyli, axisi) {
    // make the incoming variables changable via 'let'.
    let sph = (isNaN(sphi)) ? 0 : sphi;
    let cyl = (isNaN(cyli)) ? 0 : cyli;
    let axis = (isNaN(axisi)) ? 0 : axisi;

    // If the incoming SRx is positive cyl, convert to minus cyl.
    if (cyl > 0) {
      sph = sph + cyl;
      cyl = cyl * -1;
      axis = (axis > 90) ? axis - 90 : axis + 90;
    }

    // If the incoming prescription is spherical, return the calculated sph power.
    if (cyl == 0) {
      const clrx = sph / (1 - (sph * 0.012));
      return {sph: clrx.toFixed(2)};
    }

    // If the prescription is not spherical, calculate new sph and cyl.
    else {
      const sph1 = sph / (1 - (sph * 0.012));
      const newSph = sph + cyl;
      const sph2 = newSph / (1 - (newSph * 0.012));
      const newcyl = (sph2 - sph1);
      return {sph: sph1.toFixed(2), cyl: newcyl.toFixed(2), axis: axis};

    //   document.getElementById("prescription").innerHTML = (Math.round(clrx * 4) / 4).toFixed(2);
    }
  }

function convertOrClrx() {
    // Get OD current cl
    const currentSphOD = parseFloat(document.getElementById("currentSphOD").value);
    const currentCylOD = parseFloat(document.getElementById("currentCylOD").value);
    const currentAxisOD = parseFloat(document.getElementById("currentAxisOD").value);

    // Get OD over refraction
    const orSphOD = parseFloat(document.getElementById("orSphOD").value);
    const orCylOD = parseFloat(document.getElementById("orCylOD").value);
    const orAxisOD = parseFloat(document.getElementById("orAxisOD").value);
    
    // Get OS current cl
    const currentSphOS = parseFloat(document.getElementById("currentSphOS").value);
    const currentCylOS = parseFloat(document.getElementById("currentCylOS").value);
    const currentAxisOS = parseFloat(document.getElementById("currentAxisOS").value);

    // Get OS over refraction
    const orSphOS = parseFloat(document.getElementById("orSphOS").value);
    const orCylOS = parseFloat(document.getElementById("orCylOS").value);
    const orAxisOS = parseFloat(document.getElementById("orAxisOS").value);

    // Calculate the overrefraction for OD and OS
    const newCLRxOD = calcNewContacts(currentSphOD, currentCylOD, currentAxisOD, orSphOD, orCylOD, orAxisOD);
    const newCLRxOS = calcNewContacts(currentSphOS, currentCylOS, currentAxisOS, orSphOS, orCylOS, orAxisOS);
    const sphEquivOD = calcSphEquiv(newCLRxOD.sph, newCLRxOD.cyl);
    const sphEquivOS = calcSphEquiv(newCLRxOS.sph, newCLRxOS.cyl);

    // Place the new CLRx into the table
    // OD
    displaySph(document.getElementById("newSphOD"), newCLRxOD.sph.toFixed(2));
    const newAxisOD = (newCLRxOD.axis > 90) ? newCLRxOD.axis - 90 : newCLRxOD.axis + 90;
    displayCyl(document.getElementById("newCylOD"), document.getElementById("newAxisOD"), newCLRxOD.cyl.toFixed(2), newAxisOD);
    displaySphEquiv(document.getElementById("sphEquivOD"), sphEquivOD);

    // OS
    displaySph(document.getElementById("newSphOS"), newCLRxOS.sph.toFixed(2));
    const newAxisOS = (newCLRxOS.axis > 90) ? newCLRxOS.axis - 90 : newCLRxOS.axis + 90;
    displayCyl(document.getElementById("newCylOS"), document.getElementById("newAxisOS"), newCLRxOS.cyl.toFixed(2), newAxisOS);
    displaySphEquiv(document.getElementById("sphEquivOS"), sphEquivOS);
}

  function calcNewContacts(clSphi, clCyli, clAxisi, orSphi, orCyli, orAxisi) {
    //set important variables that need to be changeable
    let newClrx = {};
    let clSph = (isNaN(clSphi)) ? 0 : clSphi;//(axis > 90) ? axis - 90 : axis + 90
    let clCyl = (isNaN(clCyli)) ? 0 : clCyli;
    let clAxis = (isNaN(clAxisi)) ? 0 : clAxisi;
    let orSph = (isNaN(orSphi)) ? 0 : orSphi;
    let orCyl = (isNaN(orCyli)) ? 0 : orCyli;
    let orAxis = (isNaN(orAxisi)) ? 0 : orAxisi;
    
    // convert to plus cyl if necessary
    let currentCl = {sph: clSph, cyl: clCyl, axis: clAxis};
    if (clCyl > 0) {currentCl = convert(clSph, clCyl, clAxis);}
  
    // console.log(currentCl)
    
    // convert to plus cyl if necessary
    let overRefraction = {sph: orSph, cyl: orCyl, axis: orAxis};
    if (orCyl > 0) {overRefraction = convert(orSph, orCyl, orAxis);}
    
    // console.log(overRefraction)
    
    // select the smaller angle as group 1
    if (clAxis < orAxis) {
      newClrx = doConversion(currentCl.sph, currentCl.cyl, currentCl.axis, overRefraction.sph, overRefraction.cyl, overRefraction.axis);
      if (newClrx.cyl > 0) {newClrx = convert(newClrx.sph, newClrx.cyl, newClrx.axis)}
      return newClrx;
    } else {
      newClrx = doConversion(overRefraction.sph, overRefraction.cyl, overRefraction.axis, currentCl.sph, currentCl.cyl, currentCl.axis);
      if (newClrx.cyl > 0) {newClrx = convert(newClrx.sph, newClrx.cyl, newClrx.axis)}
      return newClrx;
    }
  }
  
  function doConversion(sph1, cyl1, axis1, sph2, cyl2, axis2) {
    // calculate the coordinate of point R
    const x1 = cyl1 * (Math.cos(2 * axis1 * Math.PI / 180));
    const y1 = cyl1 * (Math.sin(2 * axis1 * Math.PI / 180));
    const x2 = cyl2 * (Math.cos(2 * axis2 * Math.PI / 180));
    const y2 = cyl2 * (Math.sin(2 * axis2 * Math.PI / 180));
    const xR = x1 + x2;
    const yR = y1 + y2;
    
    // console.log(`x1: ${x1}, x2: ${x2}, y1: ${y1}, y2: ${y2}, xR: ${xR}, yR: ${yR},`);
    
    // Find the new cylinder power
    const cylR = Math.sqrt((xR * xR) + (yR * yR));
    
    // Total spherical power
    const sphT = ((cyl1 + cyl2 - cylR) / 2) + sph1 + sph2;
    // console.log(typeof sphT.toFixed(2))
    
    // Get the new axis
    const a = axis2 - axis1;
    const tan2B = (cyl2 * Math.sin(2 * a * Math.PI / 180)) / (cyl1 + cyl2 * Math.cos(2 * a * Math.PI / 180));
    const B = (Math.atan(tan2B) * 180 / Math.PI) / 2
    const rOSA = axis1 + B;
    
    // console.log(`a: ${a}, tan2B: ${tan2B}, B: ${B}`)
    
    return {sph: sphT, cyl: cylR, axis: rOSA};
  }


  // Takes a prescription and flips between plus cyl and minus cyl
  function convert(sph, cyl, axis) {
    const newSph = sph + cyl;
    const newCyl = cyl * -1;
    const newAxis = (axis > 90) ? axis - 90 : axis + 90;
    return {sph: newSph, cyl: newCyl, axis: newAxis}
  }

function displaySph(element, sph) {
    if (sph == 0 || isNaN(sph)) {
        element.innerHTML = "plano";
    } else {
        element.innerHTML = sph;
    }
}

function displayCyl(elementCyl, elementAxis, cyl, axis) {
    if (cyl == 0 || isNaN(cyl)) {
        elementCyl.innerHTML = "sph";
        elementAxis.innerHTML = "";
    } else {
        elementCyl.innerHTML = cyl;
        elementAxis.innerHTML = Math.round(axis);
    }
}

function displaySphEquiv(element, sphEquiv) {
  // console.log(sphEquiv)
  if (sphEquiv == 0 || isNaN(sphEquiv)) {
    element.innerHTML = "sph";
  } else {
    element.innerHTML = sphEquiv;
  }
}

function calcSphEquiv(sph, cyl) {
  // console.log(sph)
  // console.log(cyl)
  const sphEquiv = parseFloat(sph) + (cyl / 2);
  return (Math.round(sphEquiv * 4) / 4).toFixed(2);
}

function roundClrx() {
  const sphOD = parseFloat(document.getElementById("newSphOD").innerHTML);
  const cylOD = parseFloat(document.getElementById("newCylOD").innerHTML);
  const sphOS = parseFloat(document.getElementById("newSphOS").innerHTML);
  const cylOS = parseFloat(document.getElementById("newCylOS").innerHTML);

  const newSphOD = (Math.round(sphOD * 4) / 4).toFixed(2);
  const newCylOD = (Math.round((cylOD + 0.25) * 2) / 2 - 0.25).toFixed(2);
  const newSphOS = (Math.round(sphOS * 4) / 4).toFixed(2);
  const newCylOS = (Math.round((cylOS + 0.25) * 2) / 2 - 0.25).toFixed(2);

  document.getElementById("newSphOD").innerHTML = (isNaN(newSphOD)) ? "Plano" : newSphOD;
  document.getElementById("newCylOD").innerHTML = (isNaN(newCylOD)) ? "Sph" : newCylOD;
  document.getElementById("newSphOS").innerHTML = (isNaN(newSphOS)) ? "Plano" : newSphOS;
  document.getElementById("newCylOS").innerHTML = (isNaN(newCylOS)) ? "Sph" : newCylOS;

  // const sphEquivOD = calcSphEquiv(newSphOD, newCylOD);
  // const sphEquivOS = calcSphEquiv(newSphOS, newCylOS);
  // displaySphEquiv(document.getElementById("sphEquivOD"), sphEquivOD);
  // displaySphEquiv(document.getElementById("sphEquivOS"), sphEquivOS);
}


//((test + 0.25) * 2) / 2 - 0.25