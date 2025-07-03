import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CONTACT_TYPES from "../../data/contactTypes";
import iconMap from "../../data/contactIcons";
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function VibeEditor({ initialFields, initialDescription, onCancel, onSave }) {
  const [fields, setFields] = useState(initialFields);
  const [description, setDescription] = useState(initialDescription);
  const [addOpen, setAddOpen] = useState(false);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = [...fields];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        setFields(reordered);
      }
    }
  }

  function handleFieldChange(idx, value) {
    setFields(fields => {
      const newFields = [...fields];
      newFields[idx].value = value;
      return newFields;
    });
  }

  function addContact(type) {
    if (fields.some(f => f.type === type.key)) return;
    setFields([
      ...fields,
      { id: Math.random().toString(36).slice(2), label: type.label, value: "", type: type.key }
    ]);
    setAddOpen(false);
  }

  function removeField(idx) {
    setFields(fields => fields.filter((_, i) => i !== idx));
  }

  function handleSave(e) {
    e.preventDefault();
    onSave({ description, fieldsDTO: fields });
  }

  return (
    <div style={{
      margin: "0 auto",
      // marginTop: 0,
      // width: "clamp(320px, 44vw, 520px)",
      background: "#fcfdff",
      borderRadius: 24,
      boxShadow: "0 8px 44px #e4eafc55",
      // padding: "0px 0px 28px 0px",
      width: "100%",
      // minHeight: 540,
      transition: "box-shadow 0.18s"
    }}>
      <form onSubmit={handleSave} className="w-100">
        {/* Описание вайба */}
        <div className="mb-4">
          <label className="form-label fw-semibold" style={{ fontSize: 19, marginBottom: 8 }}>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{
              borderRadius: 15,
              fontSize: 16.5,
              padding: "14px 16px",
              minHeight: 65,
              boxShadow: "0 2px 10px #ecf1fb",
              background: "#f7faff",
              border: "1.7px solid #e8eefd",
            }}
            placeholder="Describe your vibe…"
          />
        </div>

        {/* Добавить контакт */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="btn btn-outline-primary d-flex align-items-center px-3 py-2"
            style={{
              borderRadius: 15,
              fontWeight: 600,
              fontSize: 17,
              boxShadow: "0 1px 4px #e4e8fb",
              gap: 9,
              background: "#fafdff"
            }}
            onClick={() => setAddOpen(o => !o)}
          >
            <FaPlus /> Add Contact
            {addOpen ? <FaChevronUp size={15} style={{ marginLeft: 5 }} /> : <FaChevronDown size={15} style={{ marginLeft: 5 }} />}
          </button>
          {addOpen && (
            <div
              style={{
                background: "#f6faff",
                border: "1.7px solid #e8eefd",
                borderRadius: 18,
                marginTop: 14,
                marginBottom: 7,
                padding: "13px 15px 8px 15px",
                boxShadow: "0 2px 14px #e6e8f8",
                zIndex: 2,
                position: "relative"
              }}
            >
              <div className="d-flex flex-wrap gap-2" style={{ maxHeight: 170, overflowY: "auto" }}>
                {CONTACT_TYPES.map(type => {
                  const already = fields.some(f => f.type === type.key);
                  return (
                    <button
                      key={type.key}
                      type="button"
                      className="btn btn-light d-flex align-items-center"
                      style={{
                        borderRadius: 12,
                        boxShadow: "0 1px 4px #e4e8fb",
                        fontWeight: 500,
                        background: already ? "#e9edf6" : "#fff",
                        opacity: already ? 0.44 : 1,
                        pointerEvents: already ? "none" : "auto",
                        gap: 7,
                        padding: "7px 17px",
                        fontSize: 15.2,
                        border: "none",
                        transition: "background 0.2s, box-shadow 0.2s"
                      }}
                      onClick={() => addContact(type)}
                      title={already ? "Already added" : `Add ${type.label}`}
                    >
                      <span style={{ fontSize: 20, marginRight: 4 }}>{iconMap[type.key]}</span>
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "#e8ebf3",
          width: "100%",
          margin: "28px 0 16px 0"
        }} />

        {/* Drag&Drop контактов */}
        <div className="mb-2" style={{ minHeight: 54 }}>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field, idx) => (
                <SortableField
                  key={field.id}
                  field={field}
                  idx={idx}
                  onChange={val => handleFieldChange(idx, val)}
                  onRemove={() => removeField(idx)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Кнопки */}
        <div className="d-flex gap-3 mt-5 justify-content-end">
          <button className="btn btn-success px-5 py-2" type="submit" style={{
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 17,
            boxShadow: "0 1px 10px #e2ffe2",
            transition: "background 0.2s"
          }}>
            Save
          </button>
          <button className="btn btn-outline-secondary px-5 py-2" type="button" style={{
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 17
          }} onClick={onCancel}>
            Cancel
          </button>
        </div>

      </form>

      <style>
        {`
          .vibe-edit-sortable:hover, .vibe-edit-sortable:focus-within {
            box-shadow: 0 8px 32px #e2eafe99;
            transform: translateY(-2px) scale(1.013);
            border-color: #6c77fa !important;
          }
          .vibe-edit-sortable input:focus {
            outline: none;
            box-shadow: 0 2px 10px #c2d4ff;
            border: 1.5px solid #6c77fa;
          }
          .vibe-edit-delete-btn:hover {
            background: #ffe4e4 !important;
            border-color: #fa7272 !important;
          }
        `}
      </style>
    </div>
  );
}

function SortableField({ field, idx, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      className="vibe-edit-sortable"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.52 : 1,
        background: "#f7f9fd",
        borderRadius: 13,
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 2px 10px #e7ebf6",
        border: "1.7px solid #eef1f7",
        padding: "11px 16px 11px 7px",
        minHeight: 48,
        position: "relative",
        cursor: isDragging ? "grabbing" : "default",
        zIndex: isDragging ? 3 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <span style={{ cursor: "grab", fontSize: 23, color: "#a0a6b8", marginRight: 4, userSelect: "none" }}>☰</span>
      <span style={{ minWidth: 30, fontSize: 21, color: "#4262db" }}>{iconMap[field.type] || "🔗"}</span>
      <input
        className="form-control"
        style={{
          flex: 1,
          fontWeight: 500,
          background: "none",
          border: "none",
          fontSize: 16.2,
          minWidth: 0,
          boxShadow: "none",
        }}
        value={field.value}
        placeholder={field.label}
        onChange={e => onChange(e.target.value)}
        autoFocus={false}
      />
      <button
        type="button"
        className="btn btn-outline-danger btn-sm vibe-edit-delete-btn"
        style={{
          borderRadius: 9,
          padding: "5px 8px",
          fontWeight: 600,
          fontSize: 15,
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
        onClick={onRemove}
        title="Delete"
      >
        <FaTrash size={15} />
      </button>
    </div>
  );
}
