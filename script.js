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

    // Put new OD CLRx into the awaiting table
    displaySph(document.getElementById("newSphOD"), clrxOD.sph);
    displayCyl(document.getElementById("newCylOD"), document.getElementById("newAxisOD"), clrxOD.cyl, clrxOD.axis);
    // document.getElementById("newSphOD").innerHTML = clrxOD.sph;
    // if (!isNaN(clrxOD.cyl)) {
    //     document.getElementById("newCylOD").innerHTML = clrxOD.cyl;
    //     document.getElementById("newAxisOD").innerHTML = clrxOD.axis;
    // }

    // Put new OS CLRx into the awaiting table
    displaySph(document.getElementById("newSphOS"), clrxOS.sph);
    displayCyl(document.getElementById("newCylOS"), document.getElementById("newAxisOS"), clrxOS.cyl, clrxOS.axis);
    // document.getElementById("newSphOS").innerHTML = clrxOS.sph;
    // document.getElementById("newCylOS").innerHTML = clrxOS.cyl;
    // document.getElementById("newAxisOS").innerHTML = clrxOS.axis;
}

function calcContacts(sphi, cyli, axisi) {
    // make the incoming variables changable via 'let'.
    let sph = sphi;
    let cyl = cyli;
    let axis = axisi;

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
      return {sph: (Math.round(sph1 * 4) / 4).toFixed(2), cyl: (Math.round(newcyl * 4) / 4).toFixed(2), axis: axis};

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

    // Place the new CLRx into the table
    displaySph(document.getElementById("newSphOD"), newCLRxOD.sph.toFixed(2));
    const newAxisOD = (newCLRxOD.axis > 90) ? newCLRxOD.axis - 90 : newCLRxOD.axis + 90;
    displayCyl(document.getElementById("newCylOD"), document.getElementById("newAxisOD"), newCLRxOD.cyl.toFixed(2), newAxisOD);
    // document.getElementById("newSphOD").innerHTML = newCLRxOD.sph.toFixed(2);
    // document.getElementById("newCylOD").innerHTML = newCLRxOD.cyl.toFixed(2);
    // document.getElementById("newAxisOD").innerHTML = (newCLRxOD.axis > 90) ? newCLRxOD.axis - 90 : newCLRxOD.axis + 90;

    displaySph(document.getElementById("newSphOS"), newCLRxOS.sph.toFixed(2));
    const newAxisOS = (newCLRxOS.axis > 90) ? newCLRxOS.axis - 90 : newCLRxOS.axis + 90;
    displayCyl(document.getElementById("newCylOS"), document.getElementById("newAxisOS"), newCLRxOS.cyl.toFixed(2), newAxisOS)
    // document.getElementById("newSphOS").innerHTML = newCLRxOS.sph.toFixed(2);
    // document.getElementById("newCylOS").innerHTML = newCLRxOS.cyl.toFixed(2);
    // document.getElementById("newAxisOS").innerHTML = (newCLRxOS.axis > 90) ? newCLRxOS.axis - 90 : newCLRxOS.axis + 90;
}

  function calcNewContacts(clSphi, clCyli, clAxisi, orSphi, orCyli, orAxisi) {
    //set important variables that need to be changeable
    let newClrx = {};
    let clSph = clSphi;
    let clCyl = clCyli;
    let clAxis = clAxisi;
    let orSph = orSphi;
    let orCyl = orCyli;
    let orAxis = orAxisi;
    
    // convert to plus cyl if necessary
    const currentCl = convert(clSph, clCyl, clAxis);
  
    // console.log(`current clrx: ${currentCl}`)
    
    // convert to plus cyl if necessary
    const overRefraction = convert(orSph, orCyl, orAxis);
    
    // console.log(`over refraction: ${overRefraction}`)
    
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
        elementAxis.innerHTML = axis;
    }
}