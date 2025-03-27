import React, { useState } from 'react'
import '@/styles/ui/CustomSelect.css'
import { FaAngleDown, FaPlus } from 'react-icons/fa6'
import { Spacer } from '@geist-ui/core'
import { RxCross2 } from 'react-icons/rx'
import { useFieldArray, useForm } from 'react-hook-form'

const CustomSelect = ({
  searchComponent,
  formDataTags,
  tagChoices,
  formData,
  handleAddNewTag,
  isSearchedTagFound,
}) => {
  console.dir(formDataTags, { depth: null })

  const [showOptions, setShowOptions] = useState(false)
  const [addedTags, setAddedTags] = useState([])
  const allAddedTags = [...new Set(addedTags)]

  const {
    register,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      tags: [],
    },
  })
  const { fields } = useFieldArray({
    control,
    name: 'tags',
  })
  console.log(fields, 'fields')

  const handleAddTag = (id) => {
    // setAddedTags((prev)=> ({...prev,id}))
    setAddedTags((prev) => [...prev, id])
  }

  // console.log(allAddedTags);

  const handleDeleteTag = (e, id) => {
    e.stopPropagation()
    setAddedTags((prev) => prev.filter((filteredId) => filteredId !== id))
  }

  return (
    <div
      id="customSelect"
      style={{
        position: 'relative',
      }}
    >
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="customSelectTrigger"
      >
        {allAddedTags.length > 0 ? (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              maxWidth: '350px',
            }}
          >
            {allAddedTags?.map((singleAddedTag) => {
              const exactTag = tagChoices.find(
                (choice) => String(choice.id) === String(singleAddedTag)
              )

              // console.log(exactTag.label);
              return (
                <span
                  style={{
                    background: '#dedede4d',
                    padding: '2px 5px 2px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  {...register('tags')}
                >
                  {exactTag?.name}
                  <RxCross2
                    onClick={(e) => handleDeleteTag(e, singleAddedTag)}
                  />
                </span>
              )
            })}
          </div>
        ) : (
          <span>Select Tags</span>
        )}
        <FaAngleDown
          style={
            showOptions
              ? {
                  rotate: '180deg',
                  transition: 'all linear 0.3s',
                }
              : { rotate: '0deg', transition: 'all linear 0.3s' }
          }
        />
      </div>
      {showOptions && (
        <div className="selectOptions">
          <Spacer h={0.5}></Spacer>
          <div
            style={{
              position: 'relative',
            }}
          >
            {searchComponent}
            <div className="addTagBtn" onClick={handleAddNewTag}>
              <FaPlus />
            </div>
          </div>
          <div className="allOptions">
            {isSearchedTagFound && (
              <p style={{ fontSize: '12px' }}>this tag is not found !</p>
            )}
            {formDataTags.length > 0
              ? formDataTags?.map((tag) => (
                  <div
                    onClick={() => handleAddTag(String(tag.id))}
                    className="singleOption"
                  >
                    <p>{tag.name}</p>
                  </div>
                ))
              : tagChoices?.map((choice) => (
                  <div
                    onClick={() => handleAddTag(String(choice.id))}
                    className="singleOption"
                  >
                    <p>{choice.name}</p>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
