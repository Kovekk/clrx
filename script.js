// Director function for creating CLRx from MRx
function mrx_to_clrx(round = true) {
  // Get the OD SRx
  srxOD = {
    sph: parseFloat(document.getElementById("sphOD").value),
    cyl: parseFloat(document.getElementById("cylOD").value),
    axs: parseFloat(document.getElementById("axisOD").value)
  };

  // Get the OS SRx
  srxOS = {
    sph: parseFloat(document.getElementById("sphOS").value),
    cyl: parseFloat(document.getElementById("cylOS").value),
    axs: parseFloat(document.getElementById("axisOS").value)
  };

  // Check all values to ensure they are numbers. Convert to 0 where necessary
  srxOD = is_rx_num(srxOD);
  srxOS = is_rx_num(srxOS);

  // Convert plus cyl to minus cyl where necessary
  if (srxOD.cyl > 0) {
    srxOD = swap_plus_minus(srxOD);
  }
  if (srxOS.cyl > 0) {
    srxOS = swap_plus_minus(srxOS);
  }

  // Calculate CLRx for OD and OS
  clrxOD = calc_clrx_from_mrx(srxOD);
  clrxOS = calc_clrx_from_mrx(srxOS);

  // Round the results if round equals true
  if (round == true) {
    clrxOD = round_clrx(clrxOD);
    clrxOS = round_clrx(clrxOS);
  }

  // Calculate the spherical equivilent for OD and OS
  sph_equivOD = calc_sph_equiv(clrxOD);
  sph_equivOS = calc_sph_equiv(clrxOS);

  // Display the results
  display_srx(clrxOD, "OD");
  display_srx(clrxOS, "OS");
  display_sph_equiv(sph_equivOD, "OD");
  display_sph_equiv(sph_equivOS, "OS");
}

// Function to calculate the CLRx from the MRx
function calc_clrx_from_mrx(srx) {
  // If cyl is 0 claculate ony sph power
  if (srx.cyl == 0) {
    const clrx = srx.sph / (1 - (srx.sph * 0.012));
    return {sph: clrx};
  }

  // If cyl is not 0 do full conversion to CLRx
  else {
    // First find the second axis' sph power
    const newSph = srx.sph + srx.cyl;

    // Convert both powers from 12mm distance to 0mm distance
    const sph1 = srx.sph / (1 - (srx.sph * 0.012));
    const sph2 = newSph / (1 - (newSph * 0.012));

    // Calculate new cyl using converted numbers
    const newCyl = (sph2 - sph1);

    // return the new CLRx
    return {sph: sph1, cyl: newCyl, axs: srx.axs};
  }
}


// Director function for creating CLRx from current CLRx and over-refraction
function over_refraction(round = true) {
  // Get the OD MRx
  mrxOD = {
    sph: parseFloat(document.getElementById("orSphOD").value),
    cyl: parseFloat(document.getElementById("orCylOD").value),
    axs: parseFloat(document.getElementById("orAxisOD").value)
  };

  // Get the OS MRx
  mrxOS = {
    sph: parseFloat(document.getElementById("orSphOS").value),
    cyl: parseFloat(document.getElementById("orCylOS").value),
    axs: parseFloat(document.getElementById("orAxisOS").value)
  };

  // Get the OD CLRx
  clrxOD = {
    sph: parseFloat(document.getElementById("currentSphOD").value),
    cyl: parseFloat(document.getElementById("currentCylOD").value),
    axs: parseFloat(document.getElementById("currentAxisOD").value)
  }

  // Get the OS CLRx
  clrxOS = {
    sph: parseFloat(document.getElementById("currentSphOS").value),
    cyl: parseFloat(document.getElementById("currentCylOS").value),
    axs: parseFloat(document.getElementById("currentAxisOS").value)
  }
  
  // Check all values to ensure they are numbers. Convert to 0 where necessary
  mrxOD = is_rx_num(mrxOD);
  mrxOS = is_rx_num(mrxOS);
  clrxOD = is_rx_num(clrxOD);
  clrxOS = is_rx_num(clrxOS);

  // Convert minus cyl to plus cyl where necessary
  if (mrxOD.cyl < 0) {
    mrxOD = swap_plus_minus(mrxOD);
  }
  if (mrxOS.cyl < 0) {
    mrxOS = swap_plus_minus(mrxOS);
  }
  if (clrxOD.cyl < 0) {
    clrxOD = swap_plus_minus(clrxOD);
  }
  if (clrxOS.cyl < 0) {
    clrxOS = swap_plus_minus(clrxOS);
  }

  // Calculate the new CLRx with over-refraction
  // If clrxOD axis is less than mrxOD axis set clrxOD as first variable
  if (clrxOD.axs < mrxOD.axs) {
    new_clrxOD = calc_or(clrxOD, mrxOD);
  }

  // Otherwise mrxOD should be first
  else {
    new_clrxOD = calc_or(mrxOD, clrxOD);
  }

  // Same for OS
  if (clrxOS.axs < mrxOS.axs) {
    new_clrxOS = calc_or(clrxOS, mrxOS);
  }
  else {
    new_clrxOS = calc_or(mrxOS, clrxOS);
  }

  // Convert to minus cyl if necessary
  if (new_clrxOD.cyl > 0) {
    new_clrxOD = swap_plus_minus(new_clrxOD);
  }
  if (new_clrxOS.cyl > 0) {
    new_clrxOS = swap_plus_minus(new_clrxOS);
  }

  // Round the results if round equals true
  if (round == true) {
    new_clrxOD = round_clrx(new_clrxOD);
    new_clrxOS = round_clrx(new_clrxOS);
  }

  // Calculate the spherical equivilent for OD and OS
  sph_equivOD = calc_sph_equiv(new_clrxOD);
  sph_equivOS = calc_sph_equiv(new_clrxOS);

  // Display the results
  display_srx(new_clrxOD, "OD");
  display_srx(new_clrxOS, "OS");
  display_sph_equiv(sph_equivOD, "OD");
  display_sph_equiv(sph_equivOS, "OS");
}

// Perform over-refraction calculation
function calc_or(rx1, rx2) {
  // calculate the coordinate of point R
  const x1 = rx1.cyl * (Math.cos(2 * rx1.axs * Math.PI / 180));
  const y1 = rx1.cyl * (Math.sin(2 * rx1.axs * Math.PI / 180));
  const x2 = rx2.cyl * (Math.cos(2 * rx2.axs * Math.PI / 180));
  const y2 = rx2.cyl * (Math.sin(2 * rx2.axs * Math.PI / 180));
  const xR = x1 + x2;
  const yR = y1 + y2;
  
  // Find the new cylinder power
  const cylR = Math.sqrt((xR * xR) + (yR * yR));
  
  // Total spherical power
  const sphT = ((rx1.cyl + rx2.cyl - cylR) / 2) + rx1.sph + rx2.sph;
  
  // Get the new axis
  const a = rx2.axs - rx1.axs;
  const tan2B = (rx2.cyl * Math.sin(2 * a * Math.PI / 180)) / (rx1.cyl + rx2.cyl * Math.cos(2 * a * Math.PI / 180));
  const B = (Math.atan(tan2B) * 180 / Math.PI) / 2
  const rOSA = rx1.axs + B;
  
  // Return the new CLRx
  return {sph: sphT, cyl: cylR, axs: rOSA};
}


// HELPER FUNCTIONS

// Swap cyl between plus and minus
function swap_plus_minus(rx) {
  const newSph = rx.sph + rx.cyl;
  const newCyl = rx.cyl * -1;
  const newAxis = (rx.axs > 90) ? rx.axs - 90 : rx.axs + 90;
  return {sph: newSph, cyl: newCyl, axs: newAxis}
}

// Calculate spherical equivalent
function calc_sph_equiv(clrx) {
  const sphEquiv = parseFloat(clrx.sph) + (clrx.cyl / 2);
  return (Math.floor((sphEquiv * 4) + 0.5) / 4);
}

// round CLRx to nearest available contact prescription
function round_clrx(clrx) {
  const sph = Math.round(clrx.sph * 4) / 4;
  const cyl = Math.round((clrx.cyl + 0.25) * 2) / 2 - 0.25;
  return {sph: sph, cyl: cyl, axs: clrx.axs};
}

// Check values to ensure they can be converted to numbers
function is_rx_num(rx) {
  let sph = (isNaN(rx.sph)) ? 0 : rx.sph;
  let cyl = (isNaN(rx.cyl)) ? 0 : rx.cyl;
  let axs = (isNaN(rx.axs)) ? 0 : rx.axs;
  return {sph: sph, cyl: cyl, axs: axs};
}

// Display new CLRx
function display_srx(srx, side) {
  // Get the elements from the html
  const sphElement = document.getElementById("newSph" + side);
  const cylElement = document.getElementById("newCyl" + side);
  const axsElement = document.getElementById("newAxis" + side);

  // If the sph is 0 then display "Plano"
  if (srx.sph == 0) {
    sphElement.innerHTML = "Plano";
  // Otherwise display the sph
  } 
  // If sph is positive display + in front of number
  else if (srx.sph > 0) {
    sphElement.innerHTML = "+" + srx.sph.toFixed(2)
  }
  // Otherwise just display sph
  else {
  sphElement.innerHTML = srx.sph.toFixed(2);
  }

  // If the cyl is 0 then display "Sph" and leave axis blank
  if (srx.cyl == 0) {
    cylElement.innerHTML = "Sph";
    axsElement.innerHTML = "";
  // Otherwise display the cyl and axis
  } else if (srx.cyl > 0) {
    cylElement.innerHTML = "+" + srx.cyl.toFixed(2);
    axsElement.innerHTML = Math.round(srx.axs);
  } else {
    cylElement.innerHTML = srx.cyl.toFixed(2);
    axsElement.innerHTML = Math.round(srx.axs);
  }
}

function display_sph_equiv(sphEquiv, side) {
  // Get the sph equivalent element
  const equivElement = document.getElementById("sphEquiv" + side);
  // Display the sph equivalent
  if (sphEquiv > 0) {
    equivElement.innerHTML = "+" + sphEquiv.toFixed(2);
  } else {
    equivElement.innerHTML = sphEquiv.toFixed(2);
  }
}

// When enter is pressed, calc contacts
const elements = document.querySelectorAll('input[type="number"]');

elements.forEach(element => {
  // Execute a function when the user presses a key on the keyboard
  element.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Trigger the button element with a click
      document.getElementById("calculate").click();
    }
  });
});