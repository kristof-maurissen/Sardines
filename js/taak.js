//$(window).load(function () {
    $(function(){

    //Tonen van de tabs jquery ui
    $("#inhoud").tabs();
    
    //Opvullen van de select landen Ajax
    var selectCountries = $("#countries");
    $.getJSON("php/ajax_json_countries.php").done(function (jeeson) {
        selectCountries.append("<option value='' selected='selected'>-- kies een land --</option>");
        $.each(jeeson, function (index, data) {
            selectCountries.append("<option value=" + jeeson[index].country_code + ">" + jeeson[index].country_name + "</option>");
        }); 
    });
    //Luchthaven bij het geselecteerd land voegen Ajax 
    selectCountries.change(function () {
        var selectLuchthaven = $("#airports");
        $.getJSON(
                "php/ajax_json_airports.php",
                {country_code: selectCountries.val()},
        function (jeeson) {
            selectLuchthaven.empty();
            selectLuchthaven.append("<option value='' selected='selected'>-- kies een luchthaven --</option>");
            $.each(jeeson, function (index, data) {
                selectLuchthaven.append("<option value=" + jeeson[index].airport_code + ">" + jeeson[index].airport_name + "</option>")
            });
        }
        );
    });
    //datepicker tonen bij alle inputvelden met de class datum
    $.datepicker.setDefaults($.datepicker.regional['nl-BE']);
    $("#vertrekdatum").datepicker({
        dateFormat: "yy-mm-dd",
        minDate: new Date(),
        maxDate: 365,
        changeMonth: true,
        changeYear: true
    });
    var vertrek = $("#vertrekdatum").datepicker("getDate"); 
    $("#terugdatum").datepicker({
       
        dateFormat: "yy-mm-dd",
        minDate: new Date(),
        maxDate: 365,
        changeMonth: true,
        changeYear: true
    });

    //retourdatum wel/niet laten zien als retour wel/niet aangevinkt is
    $("#terugdatum").parent().hide();
    $("#retour").change(function () {
        if (this.checked) {
            $("#terugdatum").parent().show();
        } else {
            $("#terugdatum").parent().hide();
        }
    });
    

    //pop up voor info boekingreferentie
    $("#dialoog").dialog({
        autoOpen: false,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        },
        modal: true,
        width: 500
    });
    $("#refinfo").click(function (e) {
                e.preventDefault();
        $("#dialoog").dialog("open");
    });

    //frmVlucht validatie
    $("#frmVlucht").submit(function (e) {
        e.preventDefault();
    });
    
    $("#frmVlucht").validate({
        rules: {
            vertrekdatum: {
                required: true,
                dateISO: true
            },
            terugdatum: {
                required: "#retour:checked",
                dateISO: true
            },
            "tickettype[]": {required: true}
        },
        messages: {
            vertrekdatum: {
                required: "Vul een vertrekdatum in",
                dateISO: "Dit is geen geldige datum (jj-mm-dd)"
            },
            terugdatum: {
                required: "Vul een aankomstdatum in",
                dateISO: "Dit is geen geldige datum (jj-mm-dd)"
            },
            "tickettype[]": "Selecteer minstens &eacute;&eacute;n optie"
        },
        
        errorPlacement: function (error, element) {
            if (element.attr("name") == "tickettype[]") {
                error.insertAfter($("#ticketflexibel"));
            } else if (element.attr("name") == "vertrekdatum") {
                error.insertAfter($("#retour"));
            }
            else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
    
    
    //frmChecking validatie
    $.validator.addMethod("refcheck", function (value, element) {
        return value.match(/^[a-zA-Z0-9]+$/i);
    });

    $("#frmCheckin").submit(function (e) {
        e.preventDefault();
    });
    $("#frmCheckin").validate({
        rules: {
            boekingreferentie: {
                minlength: 6,
                maxlength: 6,
                refcheck: true
            },
            kredietkaartnummer: "creditcard",
            familienaam: "required"
        },
        messages: {
            boekingreferentie: {
                minlength: "De boekingreferentie moet exact 6 karakters zijn",
                maxlength: "De boekingreferentie moet exact 6 karakters zijn",
                refcheck: "De boekingreferentie mag enkel letter en cijfers bevatten"
            },
            kredietkaartnummer: "Het kredietkaartnummer is niet geldig",
            familienaam: "Vul een familienaam in"
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
   
    
    });//einde document.ready
    


